const test = require("node:test");
const assert = require("node:assert");
const { exec } = require("child_process");
const fs = require("fs");
const util = require("util");
const execPromise = util.promisify(exec);

const testImageDir = "./test_images";

test("Command outputs an xlsx file when correct options are provided", async () => {
  const outputFileName = "./dist/test_output.xlsx";
  try {
    await execPromise(
      `node ./bin/index.js -i ${testImageDir} -o ${outputFileName}`
    );
    const exists = fs.existsSync(outputFileName);
    assert.strictEqual(exists, true);
  } catch (error) {
    assert.fail(`Execution failed with error: ${error}`);
  }
});

test("Command returns an error when an invalid directory is provided", async () => {
  const outputFileName = "./dist/test_output_with_invalid.xlsx";
  try {
    await execPromise(`node ./bin/index.js -i invalid -o ${outputFileName}`);
  } catch (error) {
    assert.strictEqual(error.code, 1);
  } finally {
    const exists = fs.existsSync(outputFileName);
    assert.strictEqual(exists, false);
  }
});

test("Command returns an error without -i argument", async () => {
  const outputFileName = "./dist/test_output_without_i.xlsx";
  try {
    await execPromise(`node ./bin/index.js -o ${outputFileName}`);
  } catch (error) {
    assert.strictEqual(error.code, 1);
  } finally {
    const exists = fs.existsSync(outputFileName);
    assert.strictEqual(exists, false);
  }
});

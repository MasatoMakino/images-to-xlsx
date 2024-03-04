#!/usr/bin/env node
"use strict";

const generate = require("./generate.js");
const { program } = require("commander");

program
  .requiredOption("-i, --input <inputPath>", "image directory", String)
  .option(
    "-o, --output <outputPath>",
    "output file path",
    String,
    "./images.xlsx",
  )
  .parse();

const options = program.opts();
generate(options.input, options.output);

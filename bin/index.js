#!/usr/bin/env node
"use strict";

const generate = require("./generate.js");
const program = require("commander");

program
  .usage("-i image directory")
  .option("-i, --input <path>", "image directory", String);

program
  .usage("-o output file path")
  .option("-o, --output <path>", "output file path", String, "./images.xlsx");

program.parse(process.argv);

generate(program.input, program.output);

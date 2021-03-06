#!/usr/bin/env node
"use strict";

const path = require("path");
const glob = require("glob");
const xl = require("excel4node");
const sizeof = require("image-size");
const loadImageBuffer = require("./loadImageBuffer");
const limitSize = require("./limitImageSize");
const CellResizer = require("./CellResizer");
const makeDir = require("make-dir");

let resizer;

/**
 * 画像ファイルリストを取得する。
 * @param imgDir
 * @return {*}
 */
const getImageList = imgDir => {
  return glob.sync("**/*.+(jpg|jpeg|gif|png|JPG|JPEG|GIF|PNG)", {
    cwd: imgDir
  });
};

/**
 * 指定されたシートの一行目にヘッダーを書き込む
 * @param sheet
 */
const initHeader = sheet => {
  const headers = ["Path", "FileName", "image", "width", "height"];
  headers.forEach((message, index) => {
    sheet.cell(1, index + 1).string(message);
  });
};

/**
 * セルに画像を埋め込む。
 * @param sheet
 * @param filePath 画像ファイルパス
 * @param size 画像ファイルの縦横サイズ　単位ピクセル
 * @param rowIndex
 * @return {Promise<void>}
 */
async function setImage(sheet, filePath, size, rowIndex) {
  const resize = limitSize(size, { width: 280 });
  resizer.resize(resize, rowIndex);

  const buffer = await loadImageBuffer(filePath, resize);
  sheet.addImage({
    image: buffer,
    type: "picture",
    position: {
      type: "oneCellAnchor",
      from: {
        col: resizer.columnIndex,
        colOff: resizer.getMarginMM(),
        row: rowIndex,
        rowOff: resizer.getMarginMM()
      }
    }
  });
}

/**
 * rowの書き込みを行う。
 * @param sheet 書き込み対象シート
 * @param imgDir 画像フォルダのルート
 * @param imgPath 画像ファイルパス imgDirからの相対パス
 * @param index
 * @return {Promise<void>}
 */
async function writeLine(sheet, imgDir, imgPath, index) {
  const filePath = path.resolve(imgDir, imgPath);
  const size = sizeof(filePath);
  const filename = path.basename(imgPath);

  const rowIndex = index + 2;
  sheet.cell(rowIndex, 1).string(imgPath);
  sheet.cell(rowIndex, 2).string(filename);
  sheet.cell(rowIndex, 4).number(size.width);
  sheet.cell(rowIndex, 5).number(size.height);
  await setImage(sheet, filePath, size, rowIndex);
}

/**
 * xlsxファイルを生成、出力する
 * @param imgDir リスト化する画像ファイルのルートディレクトリ
 * @param output 出力するxlsxファイルのパス
 */
function generate(imgDir, output) {
  const workbook = new xl.Workbook();
  const sheet = workbook.addWorksheet("Sheet 1");

  const imageRowIndex = 3;
  const margin = 16;
  resizer = new CellResizer(sheet, imageRowIndex, margin);
  initHeader(sheet);

  const list = getImageList(imgDir);
  const promises = [];
  list.forEach((imgPath, index) => {
    promises.push(writeLine(sheet, imgDir, imgPath, index));
  });

  Promise.all(promises)
    .then(() => {
      return makeDir(path.dirname(output));
    })
    .then(() => {
      workbook.write(output);
    });
}

module.exports = generate;

#!/usr/bin/env node
"use strict";

const sharp = require("sharp");

/**
 * 指定されたパスの画像を指定サイズにリサイズする。
 * @param {string} path 画像ファイルのパス
 * @param size 画像のリサイズ後のサイズ
 * @param {number} size.width
 * @param {number} size.height
 * @return {Promise<any>}
 */
exports.loadImageBuffer = function (path, size) {
  return new Promise((resolve, reject) => {
    sharp(path)
      .resize(size.width, size.height)
      .toBuffer()
      .then((data) => {
        resolve(data);
      });
  });
};

/**
 * 画像のメタデータを読み込む。
 * @param {string} path
 * @returns {Promise<sharp.Metadata>}
 */
exports.getImageMetadata = function (path) {
  return new Promise((resolve, reject) => {
    sharp(path)
      .metadata()
      .then((metadata) => {
        resolve(metadata);
      });
  });
};

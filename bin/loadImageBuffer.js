#!/usr/bin/env node
"use strict";

const sharp = require("sharp");

/**
 * 指定されたパスの画像を指定サイズにリサイズする。
 * @param {sharp.Sharp} sharpObj
 * @param {Object} size 画像のリサイズ後のサイズ
 * @param {number} size.width
 * @param {number} size.height
 * @return {Promise<any>}
 */
exports.loadImageBuffer = function (sharpObj, size) {
  return new Promise((resolve, reject) => {
    sharpObj
      .resize(size.width, size.height)
      .toBuffer()
      .then((data) => {
        resolve(data);
      });
  });
};

/**
 * 画像のメタデータを読み込む。
 * @param {sharp.Sharp} sharpObj
 * @returns {Promise<sharp.Metadata>}
 */
exports.getImageMetadata = function (sharpObj) {
  return new Promise((resolve, reject) => {
    sharpObj.metadata().then((metadata) => {
      resolve(metadata);
    });
  });
};

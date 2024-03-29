#!/usr/bin/env node
"use strict";

/**
 * 画像の縦横サイズを制限する。
 * @param {Object} size
 * @param {number} size.width
 * @param {number} size.height
 * @param [max]
 * @param [max.width]
 * @param [max.height = 320]
 * @return {Object} resize
 * @return {number} resize.width
 * @return {number} resize.height
 */
function limit(size, max) {
  if (max == null) {
    max = {};
  }
  if (max.height == null) {
    max.height = 320;
  }

  const resize = Object.assign({}, size);
  limitH(resize, max);
  limitW(resize, max);
  return resize;
}

function limitH(size, max) {
  if (size.height <= max.height) return size;

  const rateH = max.height / size.height;
  size.height = max.height;
  size.width = Math.floor(rateH * size.width);
}

function limitW(size, max) {
  if (max.width == null) return size;
  if (size.width <= max.width) return size;

  const rateW = max.width / size.width;
  size.width = max.width;
  size.height = Math.floor(rateW * size.height);
}

module.exports = limit;

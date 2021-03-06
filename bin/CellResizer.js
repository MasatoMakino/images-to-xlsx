#!/usr/bin/env node
"use strict";

/**
 * セルのリサイズを行う。
 * px単位で指定されたサイズに合うようセルサイズを調整する。
 */
class CellResizer {
  /**
   * コンストラクタ
   * @param sheet
   * @param {number} columnIndex
   * @param {number} [margin = 0]
   */
  constructor(sheet, columnIndex, margin = 0) {
    this.sheet = sheet;
    this.columnIndex = columnIndex;
    this.maxWidth = 0;
    this.margin = margin;

    //スケーリング定数 px -> pt
    this.SCALE_H = 0.75;
    this.SCALE_W = 0.125;
    //スケーリング定数 px -> mm
    this.SCALE_TO_MM = 0.26458;
    //TODO このスケーリング定数はdpi設定によって変化する。
  }

  /**
   * セルサイズを調整する。
   * @param size
   * @param {number} size.width
   * @param {number} size.height
   * @param {number} rowIndex
   */
  resize(size, rowIndex) {
    const h = size.height + this.margin * 2;
    this.sheet.row(rowIndex).setHeight(h * this.SCALE_H);

    if (this.maxWidth < size.width) {
      this.maxWidth = size.width;
      const w = size.width + this.margin * 2;
      this.sheet.column(this.columnIndex).setWidth(w * this.SCALE_W);
    }
  }

  /**
   * マージン指定をmmに換算して返す。
   * @return {string}
   */
  getMarginMM() {
    return this.margin * this.SCALE_TO_MM + "mm";
  }
}

module.exports = CellResizer;

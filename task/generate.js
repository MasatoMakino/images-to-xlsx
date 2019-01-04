const path = require("path");
const glob = require("glob");
const xl = require("excel4node");
const sizeof = require("image-size");
const sharp = require("sharp");

const imgDir = "./images";
const distDir = "./dist";

const list = glob.sync("**/*.+(jpg|jpeg|gif|png|JPG|JPEG|GIF|PNG)", {
  cwd: imgDir
});
const SCALE_H = 0.75;
const SCALE_W = 0.125;

//xlsxファイルの初期化
const workbook = new xl.Workbook();
const sheet = workbook.addWorksheet("Sheet 1");

//ヘッダー書き込み
const initHeader = sheet => {
  const headers = ["Path", "FileName", "image", "width", "height"];
  headers.forEach((message, index) => {
    sheet.cell(1, index + 1).string(message);
  });
};
initHeader(sheet);

/**
 * 画像の縦横サイズを制限する。
 * @param size
 * @param size.width
 * @param size.height
 * @return {*} resize
 * @return resize.width
 * @return resize.height
 */
const limitSize = size => {
  const maxH = 320;
  if (size.height <= maxH) return size;

  const resize = Object.assign({}, size);
  const rate = maxH / resize.height;
  resize.height = maxH;
  resize.width = Math.floor(rate * resize.width);
  return resize;
};

/**
 * 指定されたパスの画像を指定サイズにリサイズする。
 * @param filePath
 * @param size
 * @return {Promise<any>}
 */
function getResizeImageBuffer(filePath, size) {
  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(size.width, size.height)
      .toBuffer()
      .then(data => {
        resolve(data);
      });
  });
}

let maxW = 0;
/**
 * セルのサイズを調整する。
 * @param sheet
 * @param size
 * @param rowIndex
 */
const resizeCell = (sheet, size, rowIndex) => {
  sheet.row(rowIndex).setHeight(size.height * SCALE_H);
  if (maxW < size.width) {
    maxW = size.width;
    sheet.column(3).setWidth(size.width * SCALE_W);
  }
};

/**
 * セルに画像を埋め込む。
 * @param filePath
 * @param size
 * @param rowIndex
 * @return {Promise<void>}
 */
async function setImage(filePath, size, rowIndex) {
  let resize = limitSize(size);
  resizeCell(sheet, resize, rowIndex);

  const buffer = await getResizeImageBuffer(filePath, resize);
  sheet.addImage({
    image: buffer,
    type: "picture",
    position: {
      type: "oneCellAnchor",
      from: {
        col: 3,
        // colOff: 1,
        row: rowIndex
        // rowOff: 1
      }
    }
  });
}

/**
 * rowの書き込みを行う。
 * @param imgPath
 * @param index
 * @return {Promise<void>}
 */
async function writeLine(imgPath, index) {
  const filePath = path.resolve(imgDir, imgPath);
  const size = sizeof(filePath);
  const filename = path.basename(imgPath);

  const rowIndex = index + 2;
  sheet.cell(rowIndex, 1).string(imgPath);
  sheet.cell(rowIndex, 2).string(filename);
  sheet.cell(rowIndex, 4).number(size.width);
  sheet.cell(rowIndex, 5).number(size.height);
  await setImage(filePath, size, rowIndex);
}

//各行の書き込み
const promises = [];
list.forEach((imgPath, index) => {
  promises.push(writeLine(imgPath, index));
});

Promise.all(promises).then(() => {
  const xlsxPath = path.resolve(distDir, "images.xlsx");
  workbook.write(xlsxPath);
  console.log("write");
});

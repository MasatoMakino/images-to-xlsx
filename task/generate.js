const path = require("path");
const glob = require("glob");
const xl = require("excel4node");
const sizeof = require("image-size");
const loadImageBuffer = require("./loadImageBuffer");
const limitSize = require("./limitImageSize");
const CellResizer = require("./CellResizer");

const imgDir = "./images";
const distDir = "./dist";

const list = glob.sync("**/*.+(jpg|jpeg|gif|png|JPG|JPEG|GIF|PNG)", {
  cwd: imgDir
});

//xlsxファイルの初期化
const workbook = new xl.Workbook();
const sheet = workbook.addWorksheet("Sheet 1");
const resizer = new CellResizer(sheet, 3, 16);

//ヘッダー書き込み
const initHeader = sheet => {
  const headers = ["Path", "FileName", "image", "width", "height"];
  headers.forEach((message, index) => {
    sheet.cell(1, index + 1).string(message);
  });
};
initHeader(sheet);

/**
 * セルに画像を埋め込む。
 * @param filePath
 * @param size
 * @param rowIndex
 * @return {Promise<void>}
 */
async function setImage(filePath, size, rowIndex) {
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

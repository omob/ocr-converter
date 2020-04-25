const fs = require("fs");
const path = require("path");
const tessaract = require("node-tesseract-ocr");
const PDFDocument = require("pdfkit"); //create pdf document
const getFilePaths = require("./functions").getFilePaths;

var pdftoimage = require("pdftoimage"); //converts pdf to image

//convert to image
const convertToImages = async (filePath, tempPath) => {
  fs.mkdir(tempPath, () => {});

  try {
    await pdftoimage(filePath, {
      format: "png", // png, jpeg, tiff or svg, defaults to png
      prefix: "img", // prefix for each image except svg, defaults to input filename
      outdir: tempPath, // path to output directory, defaults to current directory
    });
  } catch (e) {
    console.log("Error converting pdf to image. \n", e);
  }
};

// convertToImage(tempDirPath);

const getTextFromImages = async (tempDirPath) => {
  // read each image file and extract text
  const filesName = fs.readdirSync(tempDirPath);

  const compiledTexts = [];
  for (const [index, file] of filesName.entries()) {
    try {
      const result = await tessaract.recognize(`${tempDirPath}\\${file}`);
      compiledTexts.push({
        text: result,
      });
    } catch (e) {
      console.log(e.message);
    }
  }
  return compiledTexts;
};

const convertTextsToPdf = (texts, outputPath) => {
  const pdfDoc = new PDFDocument();

  //   if (!fs.existsSync(outputPath))
  //     throw new Error("Destination path does not exist");

  const filePath = outputPath + ".pdf";
  pdfDoc.pipe(fs.createWriteStream(filePath));

  for (const text of texts) {
    pdfDoc.text(text.text);
  }
  pdfDoc.end();

  return filePath;
};

const clearTempFolder = (tempDirPath) => {
  fs.rmdir(tempDirPath, { recursive: true }, () => {});
};

const runConversion = async (filePath, destPath) => {
  const { tempDirPath, outputPath: _outputPath, tempDirName } = getFilePaths(
    filePath
  );

  const destinationPath = destPath
    ? path.resolve(destPath, tempDirName)
    : _outputPath;

  await convertToImages(filePath, tempDirPath);
  const readTexts = await getTextFromImages(tempDirPath);
  const convertedFilePath = convertTextsToPdf(readTexts, destinationPath);
  clearTempFolder(tempDirPath);

  return convertedFilePath;
};

module.exports = {
  convertToImages,
  getTextFromImages,
  convertTextsToPdf,
  clearTempFolder,
  runConversion,
};

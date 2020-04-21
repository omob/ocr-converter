const fs = require("fs");
const path = require("path");
const tessaract = require("node-tesseract-ocr");
const PDFDocument = require("pdfkit"); //create pdf document
var pdftoimage = require("pdftoimage"); //converts pdf to image

const filePath = "assets/test1.pdf";
const tempDirName = path.basename(filePath, path.extname(filePath));
const tempDirPath = path.join(__dirname, `assets/temp/${tempDirName}`);
const outputPath = path.join(__dirname, `assets/outputs/${tempDirName}`);

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
  pdfDoc.pipe(fs.createWriteStream(outputPath + ".pdf"));

  for (const text of texts) {
    pdfDoc.text(text.text);
  }
  pdfDoc.end();
};

const clearTempFolder = () => {
  fs.rmdir(tempDirPath, { recursive: true }, () => {});
};

const run = async () => {
  try {
    // convert pdf to images
    await convertToImages(filePath, tempDirPath);
    const readTexts = await getTextFromImages(tempDirPath);
    convertTextsToPdf(readTexts, outputPath);

    clearTempFolder();

    console.log("Done");
  } catch (e) {
    console.log("Something happened: ", e);
  }
};

run();

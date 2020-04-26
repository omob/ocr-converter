const fs = require("fs");
const path = require("path");
const tessaract = require("node-tesseract-ocr");
const PDFDocument = require("pdfkit"); //create pdf document
const officegen = require("officegen");
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

const convertToWord = (texts, outputPath) => {
  const docx = officegen("docx"); //create and empty word document
  const filePath = outputPath + ".docx";

  for (const text of texts) {
    const paragraph = docx.createP();
    paragraph.addText(text.text);
  }

  const documentWriteStream = fs.createWriteStream(filePath);

  documentWriteStream.on("error", (err) => {
    throw new Error(err);
  });
  // Async call to generate the output file:
  docx.generate(documentWriteStream);

  return outputPath;
};

const clearTempFolder = (tempDirPath) => {
  fs.rmdir(tempDirPath, { recursive: true }, () => {});
};

const runConversion = async (filePath, destPath) => {
  const command = process.argv[2];

  const { tempDirPath, outputPath: _outputPath, tempDirName } = getFilePaths(
    filePath
  );

  const destinationPath = destPath
    ? path.resolve(destPath, tempDirName)
    : _outputPath;

  await convertToImages(filePath, tempDirPath);
  const readTexts = await getTextFromImages(tempDirPath);

  let convertedFilePath = "";

  if (command == "pdf") {
    convertedFilePath = convertTextsToPdf(readTexts, destinationPath);
  } else {
    // defaults to
    convertedFilePath = convertToWord(readTexts, destinationPath);
  }

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

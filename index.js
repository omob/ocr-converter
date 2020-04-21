const fs = require("fs");
const path = require("path");
const tessaract = require("node-tesseract-ocr");

const PDFDocument = require("pdfkit");

const filePath = "assets/MemartWapicLife.pdf";
const outputPath = path.join(__dirname, "test.pdf");

const convertToPdf = (text, outputPath) => {
  const pdfDoc = new PDFDocument();

  pdfDoc.pipe(fs.createWriteStream(outputPath));
  pdfDoc.text(text);
  pdfDoc.end();
};

const run = async () => {
  try {
    const result = await tessaract.recognize(filePath);
    console.log(result);
    // convertToPdf(result, outputPath);
  } catch (e) {
    console.log(e.message);
  }
};

run();

const fs = require("fs");
const path = require("path");

const getFilePaths = (filePath) => {
  const tempDirName = path.basename(filePath, path.extname(filePath));
  const tempDirPath = path.join(__dirname, `assets/temp/${tempDirName}`);
  const outputPath = path.join(__dirname, `assets/outputs/${tempDirName}`);

  return {
    tempDirName,
    tempDirPath,
    outputPath,
  };
};

module.exports.getFilePaths = getFilePaths;

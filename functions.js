const fs = require("fs");
const path = require("path");

const getFilePaths = (filePath) => {
  let trimmedFilePath = filePath.replace(/\s+/g, "");
  const tempDirName = path.basename(
    trimmedFilePath,
    path.extname(trimmedFilePath)
  );
  const tempDirPath = path.join(__dirname, `assets/temp/${tempDirName}`);
  const outputPath = path.join(__dirname, `assets/outputs/${tempDirName}`);

  return {
    tempDirName,
    tempDirPath,
    outputPath,
  };
};

module.exports.getFilePaths = getFilePaths;

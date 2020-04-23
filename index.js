const yargs = require("./yargs-startup");
const convert = require("./conversion");
const filePath = "./assets/test1.pdf";

const run = async () => {
  try {
    await convert.runConversion(filePath);
    console.log("Done");
  } catch (e) {
    console.log("Something happened: ", e);
  }
};

if (!process.argv[2]) run();

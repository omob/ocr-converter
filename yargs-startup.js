const yargs = require("yargs");
const path = require("path");
const convert = require("./conversion");

yargs.command({
  command: "doc",
  describe: "Convert to Word Document",
  builder: {
    filepath: {
      describe: "File path",
      demandOption: true,
    },
    destination: {
      describe: "Destination Path",
      demandOption: true,
    },
  },
  handler: async (argv) => {
    try {
      const { filepath, destination } = argv;
      await convert.runConversion(filepath, path.resolve(destination));
      console.log("Done");
    } catch (e) {
      console.log(e);
    }
  },
});

yargs.parse();

module.exports = yargs;

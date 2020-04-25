const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use("/api/upload", require("./routes").fileUpload);
app.listen(port, () => console.log(`OCR App is listening on port ${port}!`));

// const yargs = require("./yargs-startup");
// const convert = require("./conversion");
// const filePath = "./assets/test1.pdf";

// const run = async () => {
//   try {
//     await convert.runConversion(filePath);
//     console.log("Done");
//   } catch (e) {
//     console.log("Something happened: ", e);
//   }
// };

// if (!process.argv[2]) run();

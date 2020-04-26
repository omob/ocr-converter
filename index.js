const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use("/api/upload", require("./routes").fileUpload);

const yargs = require("./yargs-startup");

const init = () => {
  app.listen(port, () => console.log(`OCR App is listening on port ${port}!`));
};

if (!process.argv[2]) init();

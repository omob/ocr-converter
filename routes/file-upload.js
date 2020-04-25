const router = require("express").Router();
const multer = require("multer");
const convert = require("../conversion");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/", async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) return res.status(500).json(err);
    if (err) return res.status(500).json(err);

    //after successful upload
    // do the conversion and return
    //return the path of the converted file
    const result = await convert.runConversion(req.file.path);
    return res.status(200).send(result);
  });
});

module.exports = router;

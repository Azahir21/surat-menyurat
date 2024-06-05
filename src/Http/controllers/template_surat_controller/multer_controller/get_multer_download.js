const express = require("express");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDownload = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.resolve(__dirname, "../../../../../template_surat/", filename);

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.get("/:filename", getDownload);

module.exports = router;

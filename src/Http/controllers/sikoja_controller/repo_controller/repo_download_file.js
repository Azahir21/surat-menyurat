const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDownloadBlob = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.resolve(__dirname, "../../../../daftar_surat/", filename);

    const buffer = fs.readFileSync(filePath);

    res.end(buffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.get("/:filename", getDownloadBlob);

module.exports = router;

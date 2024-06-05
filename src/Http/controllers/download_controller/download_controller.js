const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { DAFTAR_SURAT } = require("../../../models");

router.post(`/`, (req, res) => {
  if (req.query.filepath !== undefined) {
    handleFileRequest(req, res);
  } else if (req.body.paths !== undefined) {
    handleZipRequest(req, res);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request" });
  }
});

function handleFileRequest(req, res) {
  try {
    let filepath = decodeURIComponent(req.query.filepath);
    console.log("filepath1: ", filepath);
    filepath = path.resolve(__dirname, "../../../../", filepath);
    filepath = filepath.replace(/\\/g, "/");
    if (!fs.existsSync(filepath)) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });
    }

    res.download(filepath, (err) => {
      if (err) {
        console.error("Error:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
}

async function handleZipRequest(req, res) {
  const paths = req.body.paths;

  const formattedPathsPromises = paths.map(async (file_path, index) => {
    file_path = decodeURIComponent(file_path);
    const fileName = await DAFTAR_SURAT.findOne({
      where: { path: file_path },
    });

    return {
      path: path.join(__dirname, `../../../../${file_path}`),
      name: `${index + 1} ${fileName.judul}`,
    };
  });

  const formattedPaths = await Promise.all(formattedPathsPromises);

  res.header("Content-Type", "application/zip");
  res.zip({
    files: formattedPaths,
    filename: "download.zip",
  });
}

router.post(`/`, async (req, res) => {});

module.exports = router;

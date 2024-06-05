const express = require("express");
const router = express.Router();
const { REPO, DAFTAR_SURAT } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");

async function get_file_path(url_code) {
  const repo = await REPO.findOne({ where: { unix_code: url_code } });
  if (!repo) {
    return "File not found";
  }
  const path_file = await DAFTAR_SURAT.findOne({
    where: {
      id: repo.surat_id,
    },
  });
  return path_file.path;
}

router.get(`/:url_code`, async (req, res) => {
  try {
    let url_code = req.params.url_code;
    let filepath = await get_file_path(url_code);
    filepath = path.resolve(__dirname, "../../../../", filepath);
    filepath = decodeURIComponent(filepath);
    if (fs.existsSync(filepath)) {
      res.download(filepath);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

module.exports = router;

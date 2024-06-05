const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { DAFTAR_SURAT } = require("../../../models");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "daftar_surat/";

    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const judul = req.body.judul || "default";
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const putSuratUrl = async (req, res, next) => {
  try {
    const { outputPath, surat_id } = req.body;

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const filePath = surat.path;
    const suratPath = filePath.replaceAll(" ", "%20");

    const update_surat = await DAFTAR_SURAT.update(
      {
        judul: surat.judul,
        path: suratPath,
      },
      {
        where: { id: surat_id },
        returning: true,
      }
    );

    return update_surat;
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.put("/", putSuratUrl);

module.exports = { router, putSuratUrl };

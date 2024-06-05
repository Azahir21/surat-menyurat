const express = require("express");
const multer = require("multer");
const path = require("path");
const { TEMPLATE_SURAT, JENIS_SURAT } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();
const fs = require("fs");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("tes1");
    const destination = "template_surat/";

    cb(null, destination);
  },
  filename: function (req, file, cb) {
    console.log("tes3");
    const judul = req.body.judul || "default";
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, filename);
    console.log("tes4");
  },
});
const upload = multer({ storage: storage });

const putMulter = async function (req, res) {
  try {
    console.log("tes2");
    const { judul, deskripsi, jenis_id } = req.body;
    const { template_id } = req.query;
    let suratFile, suratPath, judulEx;

    const data_template_surat = await TEMPLATE_SURAT.findOne({
      where: { id: template_id },
    });

    if (req.files["surat"]) {
      suratFile = req.files["surat"][0];
      suratPath = path.join(suratFile.destination, suratFile.filename).replaceAll(" ", "%20");
      judulEx = judul + path.extname(suratFile.originalname);
      const filePath = path.join(__dirname, "../../../../../", decodeURIComponent(data_template_surat.path));
      console.log(filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error:", err);
          console.log({ error: "Failed to delete file" });
        }

        console.log({ message: "Template surat update successfully" });
      });
    } else {
      judulEx = judul + path.extname(data_template_surat.judul);
    }

    const whereClause = {};
    if (req.body && jenis_id) {
      whereClause.id = jenis_id;
    }
    const jenis = await JENIS_SURAT.findOne({
      where: whereClause,
    });
    console.log("template_id", template_id);
    const template_surat = await TEMPLATE_SURAT.update(
      {
        judul: judulEx || data_template_surat.judul,
        path: suratPath || data_template_surat.path,
        jenis_id: jenis.id || data_template_surat.jenis_id,
        deskripsi: deskripsi || data_template_surat.deskripsi,
      },
      {
        where: { id: template_id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ message: "File successfully updated", template_surat });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.put("/", upload.fields([{ name: "surat", maxCount: 1 }]), putMulter);

module.exports = router;

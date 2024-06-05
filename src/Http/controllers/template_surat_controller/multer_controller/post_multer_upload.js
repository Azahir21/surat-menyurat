const multer = require("multer");
const express = require("express");
const path = require("path");
const { TEMPLATE_SURAT, JENIS_SURAT } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "template_surat/";

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
const upload = multer({ storage: storage });

const postMulter = async function (req, res) {
  try {
    const { judul, deskripsi, jenis_id } = req.body;
    const suratFile = req.files["surat"][0];

    const judulEx = judul + path.extname(suratFile.originalname);
    const suratPath = path.join(suratFile.destination, suratFile.filename).replaceAll(" ", "%20");

    const jenis = await JENIS_SURAT.findOne({
      where: { id: jenis_id },
    });

    const template_surat = await TEMPLATE_SURAT.create({
      judul: judulEx,
      path: suratPath,
      jenis_id: jenis.id || "",
      deskripsi: deskripsi || "",
    });

    res.status(StatusCodes.CREATED).json({ message: "File successfully uploaded", template_surat });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.post("/", upload.fields([{ name: "surat", maxCount: 1 }]), postMulter);

module.exports = router;

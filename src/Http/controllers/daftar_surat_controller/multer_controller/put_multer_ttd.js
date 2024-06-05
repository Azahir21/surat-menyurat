const express = require("express");
const { DAFTAR_SURAT, USERS } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const crypto = require("crypto");
const { putStatus } = require("../../status_surat_controller/put_status");
const { postNotif } = require("../../notifikasi_controller/post_notifikasi");
const router = express.Router();
const path = require("path");
const { putRepo } = require("../../sikoja_controller/repo_controller/put_repo");
const { getProgressBar } = require("./get_progress_bar");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "daftar_surat/";

    cb(null, destination);
  },

  filename: async function (req, file, cb) {
    const data_surat = await DAFTAR_SURAT.findOne({
      where: { id: req.query.surat_id },
    });

    const judul = path.extname(data_surat.judul);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}${judul}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const putMulterTtd = async function (req, res) {
  try {
    const { surat_id } = req.query;
    if (!req.files["surat"][0]) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing files in request" });
    }
    const suratFile = req.files["surat"][0];
    const suratPath = path.join(suratFile.destination, suratFile.filename).replaceAll(" ", "%20");

    const data_surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    if (!data_surat) {
      return res.status(404).json({ error: "Data surat not found" });
    }
    const user_surat = await USERS.findOne({
      where: { id: data_surat.user_id },
    });

    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const updateSurat = await DAFTAR_SURAT.update(
      {
        path: suratPath,
      },
      {
        where: { id: surat_id },
        returning: true,
      }
    );

    const reqStatus = {
      body: {
        user: user,
        isSigned: true,
        from: "daftar_surat_controller/multer_controller/put_multer_update.js",
      },
      query: {
        surat_id: surat_id,
      },
      token: req.token,
    };
    const saveStatus = await putStatus(reqStatus);

    const reqNotif = {
      body: {
        surat_id: data_surat.id,
        jabatan_id_dari: user.jabatan_id,
        jabatan_id_ke: user_surat.jabatan_id,
        isSign: true,
        persetujuan: false,
        from: `daftar_surat_controller/multer_controller/put_multer_ttd`,
      },
    };
    await postNotif(reqNotif);
    const reqRepo = {
      query: {
        surat_id: surat_id,
        from: "daftar_surat_controller/multer_controller/put_multer_ttd",
      },
    };
    await putRepo(reqRepo);

    const progressBarRes = await getProgressBar(
      {
        query: {
          surat_id: surat_id,
          from: `daftar_surat_controller/multer_controller/post_multer_upload`,
        },
      },
      {}
    );
    const progressBar = parseInt(progressBarRes.progressBar);

    return res.status(StatusCodes.CREATED).json({ message: "File successfully uploaded", updateSurat });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.put("/", upload.fields([{ name: "surat", maxCount: 1 }]), putMulterTtd);

module.exports = router;

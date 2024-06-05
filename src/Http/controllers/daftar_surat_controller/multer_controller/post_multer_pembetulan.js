const express = require("express");
const { DAFTAR_SURAT, JABATAN, USERS } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { postStatus } = require("../../status_surat_controller/post_status");
const {
  postTampilan,
} = require("../../tampilan_surat_controller/post_tampilan");
const { postNotif } = require("../../notifikasi_controller/post_notifikasi");
const { send } = require("../send_controller");
const { postRevisi } = require("../../revisi_surat_controller/post_revisi");
const { getProgressBar } = require("./get_progress_bar");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "daftar_surat/";

    cb(null, destination);
  },

  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const postPembetulan = async function (req, res) {
  try {
    const { surat_id, judul, deskripsi } = req.body;
    const suratFile = req.files["surat"][0];
    const judulExt = judul;
    const suratPath = path.join(suratFile.destination, suratFile.filename);

    const surat_lama = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });

    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    const daftar_surat = await DAFTAR_SURAT.create({
      judul: judulExt,
      jenis_id: surat_lama.jenis_id || "",
      user_id: surat_lama.user_id,
      deskripsi: deskripsi || "",
      tanggal: Date(),
      path: suratPath,
      visible: true,
    });

    const reqRevisi = {
      body: {
        surat_id_lama: surat_lama.id,
        surat_id_baru: daftar_surat.id,
        from: `daftar_surat_controller/multer_controller/put_multer_revisi`,
      },
    };
    await postRevisi(reqRevisi);

    const reqStatus = {
      body: {
        user_id: user.id,
        surat_id: daftar_surat.id,
        from: `daftar_surat_controller/multer_controller/put_multer_revisi`,
      },
    };
    const saveStatus = await postStatus(reqStatus);

    const reqTampilan = {
      body: {
        jabatan_id: jabatan.id,
        surat_id: daftar_surat.id,
        from: "daftar_surat_controller/multer_controller/put_multer_revisi",
      },
      token: req.token,
    };

    await postTampilan(reqTampilan);
    const reqTampilan2 = {
      body: {
        jabatan_id: jabatan.jabatan_atas_id,
        surat_id: daftar_surat.id,
        from: "daftar_surat_controller/multer_controller",
      },
      token: req.token,
    };
    await postTampilan(reqTampilan2);

    let reqSend;
    reqSend = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id: jabatan.id,
        from: `daftar_surat_controller/multer_controller/post_multer_upload`,
      },
    };
    await send(reqSend);

    reqSend = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id: jabatan.jabatan_atas_id,
        from: `daftar_surat_controller/multer_controller/post_multer_upload`,
      },
    };
    await send(reqSend); //akses

    const reqNotif = {
      body: {
        surat_id: daftar_surat.id,
        jabatan_id_dari: jabatan.id,
        jabatan_id_ke: jabatan.jabatan_atas_id,
        isSign: false,
        persetujuan: false,
        from: `daftar_surat_controller/multer_controller/post_multer_upload`,
      },
    };
    await postNotif(reqNotif);

    const progressBarRes = await getProgressBar(
      {
        query: {
          surat_id: daftar_surat.id,
          from: `daftar_surat_controller/multer_controller/post_multer_upload`,
        },
      },
      {}
    );

    res
      .status(StatusCodes.CREATED)
      .json({ message: "File successfully uploaded", daftar_surat });
  } catch (error) {
    console.error("Error:", error);
  }
};

router.post(
  "/",
  upload.fields([{ name: "surat", maxCount: 1 }]),
  postPembetulan
);

module.exports = router;

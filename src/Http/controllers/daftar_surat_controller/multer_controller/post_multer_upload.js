const express = require("express");
const router = express();
const { DAFTAR_SURAT, JABATAN, USERS, JENIS_SURAT } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { postStatus } = require("../../status_surat_controller/post_status");
const { postTampilan } = require("../../tampilan_surat_controller/post_tampilan");
const { postNotif } = require("../../notifikasi_controller/post_notifikasi");
const { send } = require("../send_controller");
const { getProgressBar } = require("./get_progress_bar");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = "daftar_surat/";

    cb(null, destination);
  },

  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString("hex");
    const filename = `${randomString}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const postMulter = async function (req, res) {
  try {
    const { judul, jenis_id, deskripsi } = req.body;
    const suratFile = req.files["surat"][0];
    const judulExt = judul + path.extname(suratFile.originalname);
    const suratPath = path.join(suratFile.destination, suratFile.filename);
    const jenis = await JENIS_SURAT.findOne({
      where: { id: jenis_id },
    });

    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    let daftar_surat = await DAFTAR_SURAT.create({
      judul: judulExt,
      jenis_id: jenis.id || "",
      user_id: req.token.id,
      deskripsi: deskripsi || "",
      tanggal: Date(),
      path: suratPath,
      progressBar: 0,
      visible: true,
    });

    const reqStatus = {
      body: {
        user_id: user.id,
        surat_id: daftar_surat.id,
        from: `daftar_surat_controller/multer_controller`,
      },
    };
    const saveStatus = await postStatus(reqStatus);

    const reqTampilan = {
      body: {
        jabatan_id: jabatan.id,
        surat_id: daftar_surat.id,
        from: "daftar_surat_controller/multer_controller",
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
        isSign: null,
        persetujuan: null,
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
    res.status(StatusCodes.CREATED).json({ message: "File successfully uploaded", daftar_surat });
  } catch (error) {
    console.error("Error:", error);
  }
};

router.post("/", upload.fields([{ name: "surat", maxCount: 1 }]), postMulter);

module.exports = router;

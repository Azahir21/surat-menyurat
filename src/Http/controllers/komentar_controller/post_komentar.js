const express = require("express");
const { KOMENTAR, USERS, JABATAN, DAFTAR_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const postKomentar = async function (req, res) {
  try {
    const { komentar, surat_id } = req.body;
    const user = await USERS.findOne({ where: { id: req.token.id } });
    const surat = await DAFTAR_SURAT.findOne({ where: { id: surat_id } });
    const user_surat = await USERS.findOne({ where: { id: surat.user_id } });

    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    const komen = await KOMENTAR.create({
      surat_id,
      jabatan_id_dari: user.jabatan_id,
      jabatan_id_ke: user_surat.jabatan_id,
      komentar,
    });

    return res.json({ message: "Berhasil", komen });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postKomentar);

module.exports = {
  postKomentar,
  router,
};

const express = require("express");
const { KOMENTAR, USERS, JABATAN, DAFTAR_SURAT } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putKomentar = async function (req, res) {
  try {
    const { komentar, surat_id } = req.body;
    const { komentar_id } = req.query;

    const user = await USERS.findOne({ where: { id: req.token.id } });
    const surat = await DAFTAR_SURAT.findOne({ where: { id: surat_id } });
    const user_surat = await USERS.findOne({ where: { id: surat.user_id } });

    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    const updatedKomenar = await KOMENTAR.update(
      {
        surat_id,
        jabatan_id_dari: user.jabatan_id,
        jabatan_id_ke: user_surat.jabatan_id,
        komentar,
      },
      {
        where: { id: komentar_id },
        returning: true,
      }
    );
    return res.json({ message: "Berhasil", updatedKomenar });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putKomentar);

module.exports = {
  putKomentar,
  router,
};

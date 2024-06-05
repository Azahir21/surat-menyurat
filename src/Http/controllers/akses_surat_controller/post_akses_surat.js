const express = require("express");
const { AKSES_SURAT, DAFTAR_SURAT } = require("../../../models");
const router = express.Router();

const postAksesSurat = async (req, res) => {
  const { surat_id, tambah_akses_id } = req.body;
  const surat = await DAFTAR_SURAT.findOne({
    where: { id: surat_id },
  });

  const saveAkses = await AKSES_SURAT.create({
    surat_id: surat.id,
    jabatan_id: tambah_akses_id,
  });

  if (!req.body.from) {
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Tambah akses successfully uploaded" });
  } else {
    return saveAkses;
  }
};
router.post("/", postAksesSurat);

module.exports = {
  postAksesSurat,
  router,
};

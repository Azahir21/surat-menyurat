const express = require("express");
const { NOMOR_SURAT, DAFTAR_SURAT, USERS, PRODI, FAKULTAS, JABATAN, PERIODE, JENIS_SURAT } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./../ocr_controller/ocr_controller");
const router = express.Router();

const postNomorSurat = async (req, res) => {
  try {
    const { surat_id, indikator_id } = req.body;

    let nomor;
    let nomor_surat;

    const user_login = await USERS.findOne({
      where: { id: req.token.id },
    });

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });

    const jenis = await JENIS_SURAT.findOne({
      where: { id: surat.jenis_id },
    });

    const active_periodes = await PERIODE.findAll({
      where: { status: true },
    });

    if (active_periodes.length !== 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Active period should be exactly 1" });
    } else if (!active_periodes) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "No Periode active" });
    }

    const nomor_surat_per_periode_dan_jenis = await NOMOR_SURAT.count({
      where: {
        periode_id: active_periodes[0].id,
        "$daftar_surat.jenis_id$": jenis.id,
      },
      include: [
        {
          model: DAFTAR_SURAT,
          as: "daftar_surat",
        },
      ],
    });

    if (nomor_surat_per_periode_dan_jenis > 0) {
      nomor = await NOMOR_SURAT.findAll({
        limit: 1,
        order: [["id", "DESC"]],
        where: {
          periode_id: active_periodes[0].id,
          "$daftar_surat.jenis_id$": jenis.id,
        },
        include: [
          {
            model: DAFTAR_SURAT,
            as: "daftar_surat",
          },
        ],
      });

      const existingNomor = nomor[0].nomor_surat;
      const parts = existingNomor.split("/");
      const angkaNomor = parts[0];

      nomor_surat = String(parseInt(angkaNomor, 10) + 1).padStart(4, "0");
    } else {
      nomor_surat = "0001";
    }

    const user_surat = await USERS.findOne({
      where: { id: surat.user_id },
    });

    if (!user_surat || !user_login) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    const jabatan_user_surat = await JABATAN.findOne({
      where: { id: user_surat.jabatan_id },
    });

    const prodi_user_surat = await PRODI.findOne({
      where: { id: user_surat.prodi_id },
    });
    if (!prodi_user_surat) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Prodi not found" });
    }
    const fakultas_id = user_login.fakultas_id;

    const fakultas = await FAKULTAS.findOne({
      where: { id: fakultas_id },
    });

    if (!fakultas) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Fakultas not found" });
    }

    const nama_jabatan = jabatan_user_surat.name;
    const kode_prodi = prodi_user_surat.kode_prodi;
    const kode_fakultas = fakultas.kode_fakultas;
    const kode_jenis_surat = jenis.kode_jenis;
    const temp_tahun_periode = String(active_periodes[0].tahun);
    const tahun_periode = temp_tahun_periode.split(" ")[3];

    if (prodi_user_surat.name === "-" || !prodi_user_surat || prodi_user_surat.id === 1) {
      nomor_surat = `${nomor_surat}/${kode_fakultas}/${kode_jenis_surat}/TU/${tahun_periode}`;
    } else {
      nomor_surat = `${nomor_surat}/${kode_fakultas}/${kode_jenis_surat}/TU-${kode_prodi}/${tahun_periode}`;
    }
    nomor_surat = String(nomor_surat);

    const saveNomorSurat = await NOMOR_SURAT.create({
      nomor_surat: nomor_surat,
      surat_id: surat_id,
      periode_id: active_periodes[0].id,
    });

    const reqOcr = {
      body: {
        nomor_surat_id: saveNomorSurat.id,
        surat_id: saveNomorSurat.surat_id,
        from: `nomor_surat_controller`,
      },
    };

    const saveOcr = await OCR(reqOcr);
    if (!saveOcr) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to save OCR" });
    }

    if (saveNomorSurat && saveOcr) {
      return (res = { message: "Success", saveNomorSurat, saveOcr });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR) //
        .json({ error: "Failed to save nomor surat" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.post("/", postNomorSurat);
module.exports = {
  postNomorSurat,
  router,
};

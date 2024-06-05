const express = require("express");
const { NOMOR_SURAT, REVISI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { OCR } = require("./../ocr_controller/ocr_controller");
const router = express.Router();

const postNomorSuratRevisi = async (req, res) => {
  try {
    const { surat_id, indikator_id } = req.body;

    let nomor;
    let nomor_surat;
    let updateNomorSurat;
    let revisiSurat;
    let i = 0,
      j = 0;

    revisiSurat = await REVISI.findOne({
      where: { surat_id_baru: surat_id },
    });
    do {
      if (revisiSurat) {
        nomor_surat = await NOMOR_SURAT.findOne({
          where: { surat_id: revisiSurat.surat_id_lama },
        });
      }
      revisiSurat = await REVISI.findOne({
        where: { surat_id_baru: revisiSurat.surat_id_lama },
      });
    } while (!nomor_surat);

    const nomor_surat_lama = await NOMOR_SURAT.findOne({
      where: { surat_id: nomor_surat.surat_id },
    });

    nomor = nomor_surat_lama.nomor_surat;
    let nomorSuratSplit = nomor.split("/");
    let nomorSplit = nomorSuratSplit[0];
    let nomorSplitv2 = nomorSplit.split(".");

    if (nomorSuratSplit.length === 5 && nomorSplitv2.length === 2) {
      nomorRevisi = parseInt(nomorSplitv2[1], 10);
      nomorRevisi++;
      updateNomorSurat = `${nomorSplitv2[0]}.${nomorRevisi}/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    } else if (nomorSuratSplit.length === 5) {
      updateNomorSurat = `${nomorSuratSplit[0]}.1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
    }
    nomor_surat = String(nomor_surat);

    const searchNomorSurat = await NOMOR_SURAT.findOne({
      where: { nomor_surat: nomor_surat },
    });

    if (searchNomorSurat) {
      nomor = searchNomorSurat.nomor_surat;
      nomorSuratSplit = nomor.split("/");
      nomorSplit = nomorSuratSplit[0];
      nomorSplitv2 = nomorSplit.split(".");
      if (nomorSuratSplit.length === 5 && nomorSplitv2.length === 2) {
        nomorRevisi = parseInt(nomorSplitv2[1], 10);
        nomorRevisi++;
        updateNomorSurat = `${nomorSplitv2[0]}.${nomorRevisi}/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
      } else if (nomorSuratSplit.length === 5) {
        updateNomorSurat = `${nomorSuratSplit[0]}.1/${nomorSuratSplit[1]}/${nomorSuratSplit[2]}/${nomorSuratSplit[3]}/${nomorSuratSplit[4]}`;
      }
      nomor_surat = String(nomor_surat);
    }

    const saveNomorSurat = await NOMOR_SURAT.create({
      nomor_surat: updateNomorSurat,
      surat_id: surat_id,
      periode_id: nomor_surat_lama.periode_id,
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
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to save OCR" });
    }

    if (saveNomorSurat && saveOcr) {
      return (res = { message: "Success", saveNomorSurat, saveOcr });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to save nomor surat" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postNomorSuratRevisi);
module.exports = {
  postNomorSuratRevisi,
  router,
};

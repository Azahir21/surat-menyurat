const express = require("express");
const { JENIS_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const postJenis = async function (req, res) {
  try {
    let latestJenisId;
    const { jenis, kode_jenis } = req.body;
    const latestJenis = await JENIS_SURAT.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    if (latestJenis.length > 0) {
      latestJenisId = parseInt(latestJenis[0].id, 10);
    }
    const jenis_surat = await JENIS_SURAT.create({
      id: latestJenisId + 1 || 1,
      jenis,
      kode_jenis,
    });

    return res.json({ message: "Berhasil", jenis_surat });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.post("/", postJenis);

module.exports = {
  postJenis,
  router,
};

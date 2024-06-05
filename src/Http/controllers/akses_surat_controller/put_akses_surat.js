const express = require("express");
const { AKSES_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putAksesSurat = async (req, res) => {
  try {
    const { surat_id, jabatan_id } = req.body;
    const { akses_surat_id } = req.query;

    const updateAksesSurat = await AKSES_SURAT.update(
      {
        surat_id,
        jabatan_id: jabatan_id,
      },
      { where: { id: akses_surat_id }, returning: true }
    );
    res.status(StatusCodes.OK).json({ updated: updateAksesSurat });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.put("/", putAksesSurat);

module.exports = {
  putAksesSurat,
  router,
};

const express = require("express");
const { AKSES_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteAksesSurat = async (req, res) => {
  try {
    const { akses_surat_id, surat_id, jabatan_id } = req.query;

    const whereClause = {};

    if (req.query && akses_surat_id) {
      whereClause.id = akses_surat_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }
    if (req.query && jabatan_id) {
      whereClause.jabatan_id = jabatan_id;
    }

    const deletedAksesSurat = await AKSES_SURAT.destroy({
      where: whereClause,
    });

    if (deletedAksesSurat) {
      if (!req.query.from) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Akses Surat deleted successfully" });
      } else {
        return deletedAksesSurat;
      }
    } else {
      if (res) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Akses Surat not found" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteAksesSurat);

module.exports = {
  deleteAksesSurat,
  router,
};

const express = require("express");
const { TAMPILAN } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteTampilan = async (req, res) => {
  try {
    const { tampilan_id, surat_id, jabatan_id } = req.query;

    const whereClause = {};
    if (req.query && tampilan_id) {
      whereClause.id = tampilan_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }
    if (req.query && jabatan_id) {
      whereClause.jabatan_id = jabatan_id;
    }

    const deletedTampilan = await TAMPILAN.destroy({
      where: whereClause,
    });

    if (deletedTampilan) {
      if (!req.query.from) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Tampilan deleted successfully" });
      } else {
        return deletedTampilan;
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

router.delete("/", deleteTampilan);

module.exports = {
  deleteTampilan,
  router,
};

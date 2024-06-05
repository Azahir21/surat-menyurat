const express = require("express");
const router = express.Router();
const { TAMPILAN } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const getTampilan = async (req, res) => {
  try {
    const { tampilan_id, jabatan_id, surat_id } = req.query;
    let tampilan;

    const whereClause = {};

    if (req.query && tampilan_id) {
      whereClause.id = tampilan_id;
    }

    if (req.query && jabatan_id) {
      whereClause.jabatan_id = jabatan_id;
    }

    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }

    tampilan = await TAMPILAN.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    if (req.query.from) {
      return tampilan;
    } else {
      res.status(StatusCodes.OK).json(tampilan);
    }
  } catch (error) {
    console.error("Error getting tampilan:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.get("/", getTampilan);

module.exports = {
  getTampilan,
  router,
};

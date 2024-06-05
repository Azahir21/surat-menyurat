const express = require("express");
const router = express.Router();
const { REVISI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const deleteRevisi = async (req, res) => {
  try {
    const { revisi_id, surat_id } = req.query;

    const whereClause = {};
    if (req.query && revisi_id) {
      whereClause.id = revisi_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id_baru = surat_id;
    }

    const revisi = await REVISI.destroy({ where: whereClause });
    if (revisi) {
      if (!req.query.from) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Revisi deleted successfully" });
      } else {
        return revisi;
      }
    } else {
      if (!req.query.from) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Perbaikan not found" });
      } else {
        return revisi;
      }
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

router.delete("/", deleteRevisi);

module.exports = { deleteRevisi, router };

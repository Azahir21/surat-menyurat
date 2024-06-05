const express = require("express");
const router = express.Router();
const { PERBAIKAN } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");

const deletePerbaikan = async (req, res) => {
  try {
    const { perbaikan_id, surat_id } = req.query;
    const whereClause = {};
    if (req.query && perbaikan_id) {
      whereClause.id = perbaikan_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }

    const perbaikan = await PERBAIKAN.destroy({ where: whereClause });
    if (perbaikan) {
      if (!req.query.from) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Perbaikan deleted successfully" });
      } else {
        return perbaikan;
      }
    } else {
      if (!req.query.from) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Perbaikan not found" });
      } else {
        return perbaikan;
      }
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

router.delete("/", deletePerbaikan);

module.exports = { deletePerbaikan, router };

const express = require("express");
const { NOTIFIKASI } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteNotifikasi = async (req, res) => {
  try {
    const { notifikasi_id, surat_id } = req.query;
    const whereClause = {};
    if (req.query && notifikasi_id) {
      whereClause.id = notifikasi_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }
    const notifikasi = await NOTIFIKASI.findOne({
      where: whereClause,
    });
    if (!notifikasi) {
      if (!req.query.from) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Notifikasi not found" });
      } else {
        return notifikasi;
      }
    }
    const hapusNotifikasi = await NOTIFIKASI.destroy({
      where: whereClause,
    });
    if (hapusNotifikasi) {
      if (!req.query.from) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Notifikasi surat deleted successfully" });
      } else {
        return hapusNotifikasi;
      }
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Notifikasi Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
router.delete("/", deleteNotifikasi);
module.exports = { router, deleteNotifikasi };

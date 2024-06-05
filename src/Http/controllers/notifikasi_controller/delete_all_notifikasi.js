const express = require("express");
const { NOTIFIKASI, USERS } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteAllNotifikasi = async (req, res) => {
  try {
    let hapusNotifikasi;

    const user = await USERS.findOne({
      where: { id: req.token.id },
    });

    const notifikasi = await NOTIFIKASI.findOne({
      where: { jabatan_id_ke: user.jabatan_id },
    });
    if (!notifikasi) {
      if (!req.query.from) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Notifikasi not found" });
      } else {
        return notifikasi;
      }
    }
    if (user.prodi_id === 1 || !user.prodi_id) {
      hapusNotifikasi = await NOTIFIKASI.destroy({
        where: { jabatan_id_ke: user.jabatan_id },
      });
    } else {
      hapusNotifikasi = await NOTIFIKASI.destroy({
        where: {
          jabatan_id_ke: user.jabatan_id,
          "$surat.user.prodi.id$": prodi_id,
        },
      });
    }
    if (hapusNotifikasi) {
      if (!req.query.from) {
        res.status(StatusCodes.OK).json({ message: "All Notifikasi of surat deleted successfully" });
      } else {
        return hapusNotifikasi;
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Notifikasi Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};
router.delete("/", deleteAllNotifikasi);
module.exports = { router, deleteAllNotifikasi };

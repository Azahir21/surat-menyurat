const express = require("express");
const { DAFTAR_SURAT } = require("../../../models");
const {
  deleteAksesSurat,
} = require("../akses_surat_controller/delete_akses_surat");
const {
  deleteTampilan,
} = require("../tampilan_surat_controller/delete_tampilan");
const { deleteStatus } = require("../status_surat_controller/delete_status");
const { deleteKomentar } = require("../komentar_controller/delete_komentar");
const { deleteRevisi } = require("../revisi_surat_controller/delete_revisi");
const { deletePerbaikan } = require("./perbaikan_controller/delete_perbaikan");
const {
  deleteNotifikasi,
} = require("../notifikasi_controller/delete_notifikasi");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

const deleteSurat = async (req, res) => {
  try {
    const { surat_id } = req.query;

    if (!surat_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'id' is required" });
    }

    const reqDelete = {
      query: {
        surat_id: surat_id,
        from: `daftar_surat_controller/delete_daftar_surat.js`,
      },
    };

    const deletedAksesSurat = await deleteAksesSurat(reqDelete);
    const deletedTampilan = await deleteTampilan(reqDelete);
    const deletedStatus = await deleteStatus(reqDelete);
    const deletedKomentar = await deleteKomentar(reqDelete);
    const deletedNotifikasi = await deleteNotifikasi(reqDelete);
    const deletedRevisi = await deleteRevisi(reqDelete);
    const deletedPerbaikan = await deletePerbaikan(reqDelete);
    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const deletedSurat = await DAFTAR_SURAT.destroy({
      where: { id: surat_id },
    });
    if (deletedSurat) {
      const suratPath = surat.path;
      const filePath = path.join(
        __dirname,
        "../../../../",
        decodeURIComponent(suratPath)
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error:", err);
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Failed to delete file" });
        }

        res
          .status(StatusCodes.OK)
          .json({ message: "Surat deleted successfully" });
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteSurat);

module.exports = {
  deleteSurat,
  router,
};

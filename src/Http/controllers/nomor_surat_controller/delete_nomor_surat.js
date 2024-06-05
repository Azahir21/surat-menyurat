const express = require("express");
const { NOMOR_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteNomorSurat = async (req, res) => {
  try {
    const { nomor_surat_id } = req.query;

    if (!nomor_surat_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'nomor_surat_id' is required" });
    }

    const hapusNomorSurat = await NOMOR_SURAT.destroy({
      where: { id: nomor_surat_id },
    });

    if (hapusNomorSurat) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Nomor_surat Surat deleted successfully" });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Nomor_surat Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteNomorSurat);
module.exports = { router, deleteNomorSurat };

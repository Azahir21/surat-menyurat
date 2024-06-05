const express = require("express");
const { JENIS_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteJenis = async (req, res) => {
  try {
    const { jenis_id } = req.query;

    if (!jenis_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'jenis_id' is required" });
    }

    const hapusJenis = await JENIS_SURAT.destroy({
      where: { id: jenis_id },
    });

    if (hapusJenis) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Jenis Surat deleted successfully" });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Jenis Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteJenis);
module.exports = { router, deleteJenis };

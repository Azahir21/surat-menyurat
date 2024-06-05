const express = require("express");
const { PERIODE } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deletePeriode = async (req, res) => {
  try {
    const { periode_id } = req.query;

    if (!periode_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'periode_id' is required" });
    }

    const hapusPeriode = await PERIODE.destroy({
      where: { id: periode_id },
    });

    if (hapusPeriode) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Periode Surat deleted successfully" });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Periode Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deletePeriode);
module.exports = { router, deletePeriode };

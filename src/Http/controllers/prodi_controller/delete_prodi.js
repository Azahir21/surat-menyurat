const express = require("express");
const { PRODI } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteProdi = async (req, res) => {
  try {
    const { prodi_id } = req.query;

    if (!prodi_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter prodi_id is required" });
    }

    const deletedProdi = await PRODI.destroy({
      where: { id: prodi_id },
    });

    if (deletedProdi) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Prodi deleted successfully" });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Prodi not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteProdi);

module.exports = {
  deleteProdi,
  router,
};

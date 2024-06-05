const express = require("express");
const { AKSES_MASTER } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteAksesMaster = async (req, res) => {
  try {
    const { akses_master_id } = req.query;

    if (!akses_master_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'akses_master_id' is required" });
    }

    const deletedAksesMaster = await AKSES_MASTER.destroy({
      where: { id: akses_master_id },
    });

    if (deletedAksesMaster) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Akses Master deleted successfully" });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Akses Master not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteAksesMaster);

module.exports = {
  deleteAksesMaster,
  router,
};

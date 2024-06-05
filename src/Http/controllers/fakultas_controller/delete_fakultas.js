const express = require("express");
const { FAKULTAS, PRODI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const deleteFakultas = async (req, res) => {
  try {
    const { fakultas_id } = req.query;

    if (!fakultas_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter id is required" });
    }
    await PRODI.update({ fakultas_id: null }, { where: { fakultas_id } });
    const deletedFakultas = await FAKULTAS.destroy({
      where: { id: fakultas_id },
    });

    if (deletedFakultas) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Fakultas deleted successfully" });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Fakultas not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteFakultas);

module.exports = {
  deleteFakultas,
  router,
};

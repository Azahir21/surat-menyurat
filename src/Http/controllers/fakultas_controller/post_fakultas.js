const express = require("express");
const { FAKULTAS } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postFakultas = async (req, res) => {
  const { name, jenjang, kode_fakultas } = req.body;

  try {
    const latestFakultas = await FAKULTAS.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const latestFakultasId = latestFakultas[0]
      ? parseInt(latestFakultas[0].id, 10)
      : 0;

    const fakultas = await FAKULTAS.create({
      id: latestFakultasId + 1,
      name,
      jenjang,
      kode_fakultas,
    });
    res.status(StatusCodes.CREATED).json({
      message: `${
        (fakultas.name, fakultas.jenjang, fakultas.kode_fakultas)
      } created successfully`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postFakultas);

module.exports = {
  postFakultas,
  router,
};

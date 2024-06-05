const express = require("express");
const { FAKULTAS } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putFakultas = async (req, res) => {
  try {
    const { nama, jenjang, kode_fakultas } = req.body;
    const { fakultas_id } = req.query;
    if (!fakultas_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const fakultas = await FAKULTAS.findOne({ where: { id: fakultas_id } });

    if (!fakultas) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Fakultas not found" });
    }

    const updateFakultas = await FAKULTAS.update(
      {
        name: nama || fakultas.name,
        jenjang: jenjang || fakultas.jenjang,
        kode_fakultas: kode_fakultas || fakultas.kode_fakultas,
      },
      {
        where: { id: fakultas_id },
        returning: true,
      }
    );

    res.json({ updateFakultas });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putFakultas);

module.exports = {
  putFakultas,
  router,
};

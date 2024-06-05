const express = require("express");
const { PERIODE } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putPeriodeTahun = async (req, res) => {
  try {
    const { tahun } = req.body;
    const { periode_id } = req.query;
    if (!periode_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid params" });
    }

    const data_periode = await PERIODE.findOne({ where: { id: periode_id } });

    if (!data_periode) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Periode not found" });
    }

    const periode = await PERIODE.update(
      {
        tahun,
      },
      {
        where: { id: periode_id },
        returning: true,
      }
    );

    res.json({
      updated: periode,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};
router.put("/", putPeriodeTahun);

module.exports = {
  putPeriodeTahun,
  router,
};

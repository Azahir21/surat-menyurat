const express = require("express");
const { PERIODE } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putPeriodeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { periode_id } = req.query;
    if (!periode_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid params" });
    }

    const activePeriodes = await PERIODE.findAll({ where: { status: true } });

    if (activePeriodes.length > 0) {
      const activePeriodeIds = activePeriodes.map((periode) => periode.id);

      await PERIODE.update({ status: false }, { where: { id: activePeriodeIds } });
    }

    const data_periode = await PERIODE.findOne({ where: { id: periode_id } });

    if (!data_periode) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Periode not found" });
    }

    const periode = await PERIODE.update(
      {
        status,
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

router.put("/", putPeriodeStatus);

module.exports = {
  putPeriodeStatus,
  router,
};

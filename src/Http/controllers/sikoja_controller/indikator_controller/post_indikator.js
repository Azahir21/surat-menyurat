const express = require("express");
const router = express.Router();
const { INDIKATOR } = require("../../../../models/");
const { StatusCodes } = require("http-status-codes");

const postIndikator = async (req, res) => {
  try {
    const { name, strategi_id, iku_id } = req.body;
    const latestIndikator = await INDIKATOR.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    const latestIndikatorId = parseInt(latestIndikator[0].id, 10);
    const indikator = await INDIKATOR.create({
      id: latestIndikatorId + 1,
      name,
      strategi_id,
      iku_id,
    });
    res.status(StatusCodes.CREATED).json(indikator);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

router.post("/", postIndikator);

module.exports = {
  postIndikator,
  router,
};

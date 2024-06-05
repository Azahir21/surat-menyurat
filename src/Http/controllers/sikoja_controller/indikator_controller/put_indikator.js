const express = require("express");
const { INDIKATOR } = require("../../../../models/");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putIndikator = async (req, res) => {
  try {
    const { indikator_id } = req.query;
    const { name, strategi_id, iku_id } = req.body;

    const dataIndikator = await INDIKATOR.findOne({
      where: {
        id: indikator_id,
      },
    });
    if (!dataIndikator) {
      return res.status(StatusCodes.NOT_FOUND).json("Data indikator not found");
    }

    const putIndikator = await INDIKATOR.update(
      {
        name: name || dataIndikator.name,
        strategi_id: strategi_id || dataIndikator.strategi_id,
        iku_id: iku_id || dataIndikator.iku_id,
      },
      {
        where: {
          id: indikator_id,
        },
        returning: true,
      }
    );
    res.status(StatusCodes.OK).json({
      message: "Indikator updated successfully",
      putIndikator,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

router.put("/", putIndikator);

module.exports = { router, putIndikator };

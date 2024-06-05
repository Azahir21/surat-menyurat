const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { INDIKATOR, STRATEGI, IKU } = require("../../../../models");
const router = express.Router();

const getIndikator = async (req, res) => {
  try {
    const { indikator_id, strategi_id, iku_id } = req.body;

    const whereClause = {};
    if (req.query && indikator_id.length > 0) {
      whereClause.id = indikator_id;
    }
    if (strategi_id && strategi_id.length > 0) {
      whereClause.strategi_id = {
        [Op.in]: strategi_id,
      };
    }
    if (iku_id && iku_id.length > 0) {
      whereClause.iku_id = {
        [Op.in]: iku_id,
      };
    }

    const indikator = await INDIKATOR.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
      attributes: {
        exclude: ["iku_id", "strategi_id", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: STRATEGI,
          as: "strategi",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: IKU,
          as: "iku",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return res.json({ indikator });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

router.get("/", getIndikator);
router.post("/", getIndikator);

module.exports = { router, getIndikator };

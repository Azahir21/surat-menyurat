const { INDIKATOR, STRATEGI, IKU } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const express = require("express");
const router = express.Router();

const getIndikatorAll = async (req, res) => {
  try {
    const { indikator_id } = req.query;

    let indikator;
    if (indikator_id) {
      indikator = await INDIKATOR.findOne({
        attributes: { exclude: ["iku_id", "strategi_id"] },
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
    } else if (!indikator_id) {
      indikator = await INDIKATOR.findAll({
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
    }

    return res.json({ indikator });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.get("/", getIndikatorAll);

module.exports = { getIndikatorAll, router };

const express = require("express");
const { STRATEGI } = require("../../../../models/");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getStrategi = async (req, res) => {
  try {
    const { strategi_id } = req.query;

    if (!strategi_id) {
      const allData = await STRATEGI.findAll({ order: [["id", "ASC"]] });
      res.send(allData);
    } else if (strategi_id) {
      const findOneData = await STRATEGI.findOne({
        where: { id: strategi_id },
      });

      if (findOneData) {
        res.send(findOneData);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Data not found" });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.get("/", getStrategi);

module.exports = { getStrategi, router };

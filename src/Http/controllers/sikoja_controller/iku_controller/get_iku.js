const { IKU } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");
const express = require("express");
const router = express.Router();

const getIku = async (req, res) => {
  try {
    const { iku_id } = req.query;

    if (!iku_id) {
      const allData = await IKU.findAll({ order: [["id", "ASC"]] });
      res.send(allData);
    } else if (iku_id) {
      const findOneData = await IKU.findOne({
        where: { id: iku_id },
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

router.get("/", getIku);

module.exports = { router, getIku };

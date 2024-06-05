const express = require("express");
const { AKSES_MASTER } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getAksesMaster = async (req, res) => {
  try {
    const { akses_master_id } = req.query;

    if (!akses_master_id) {
      const allData = await AKSES_MASTER.findAll({
        order: [["id", "ASC"]],
      });
      res.send(allData);
    } else if (akses_master_id) {
      const findOneData = await AKSES_MASTER.findOne({
        where: { id: akses_master_id },
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

router.get("/", getAksesMaster);
module.exports = {
  getAksesMaster,
  router,
};

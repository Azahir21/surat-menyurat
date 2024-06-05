const express = require("express");
const { PRODI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getProdi = async (req, res) => {
  const { prodi_id } = req.query;

  try {
    let prodi;

    if (!prodi_id) {
      prodi = await PRODI.findAll({
        order: [["id", "ASC"]],
      });
    } else {
      prodi = await PRODI.findOne({
        where: { id: prodi_id },
        order: [["id", "ASC"]],
      });
    }
    if (!req.body.from) {
      res.status(StatusCodes.OK).json(prodi);
    } else {
      return prodi;
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.get("/", getProdi);

module.exports = {
  getProdi,
  router,
};

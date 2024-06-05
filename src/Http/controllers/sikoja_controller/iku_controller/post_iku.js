const { StatusCodes } = require("http-status-codes");
const express = require("express");
const router = express.Router();
const { IKU } = require("../../../../models");

const postIku = async (req, res) => {
  try {
    const { name } = req.body;
    const latestIku = await IKU.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const latestIkuId = parseInt(latestIku[0].id, 10);
    const iku = await IKU.create({
      id: latestIkuId + 1,
      name,
    });
    res.status(StatusCodes.CREATED).json(iku);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.post("/", postIku);

module.exports = {
  postIku,
  router,
};

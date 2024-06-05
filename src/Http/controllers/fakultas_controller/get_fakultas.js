const express = require("express");
const { FAKULTAS } = require("../../../models");
const { Op } = require("sequelize");
const router = express.Router();

const getFakultas = async (req, res) => {
  res.send(
    await FAKULTAS.findAll({
      where: {
        id: {
          [Op.ne]: 1,
        },
      },
    })
  );
};

router.get("/", getFakultas);

module.exports = {
  getFakultas,
  router,
};

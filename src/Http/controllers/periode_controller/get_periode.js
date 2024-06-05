const express = require("express");
const { PERIODE } = require("../../../models");
const router = express.Router();

const getPeriode = async (req, res) => {
  res.send(await PERIODE.findAll({ order: [["id", "ASC"]] }));
};

router.get("/", getPeriode);

module.exports = {
  getPeriode,
  router,
};

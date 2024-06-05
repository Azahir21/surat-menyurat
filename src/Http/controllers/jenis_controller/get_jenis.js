const express = require("express");
const { JENIS_SURAT } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  res.send(
    await JENIS_SURAT.findAll({
      attributes: ["id", "jenis", "kode_jenis"],
      order: [["id", "ASC"]],
    })
  );
};

router.get("/", getAll);

module.exports = {
  getAll,
  router,
};

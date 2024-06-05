const express = require("express");
const { KOMENTAR, JABATAN } = require("../../../models");
const router = express.Router();

const getAll = async function (req, res) {
  res.send(
    await KOMENTAR.findAll({
      include: [
        {
          model: JABATAN,
          as: "jabatan_ke",
          attributes: ["name"],
        },
        {
          model: JABATAN,
          as: "jabatan_dari",
          attributes: ["name"],
        },
      ],
      attributes: ["komentar", "surat_id"],
      order: [["id", "ASC"]],
    })
  );
};

router.get("/", getAll);

module.exports = {
  getAll,
  router,
};

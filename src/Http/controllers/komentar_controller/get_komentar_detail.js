const express = require("express");
const { KOMENTAR, JABATAN } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const getDetail = async function (req, res) {
  try {
    const komen = await KOMENTAR.findOne({
      where: { surat_id: req.query.surat_id },
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
    });
    if (komen) {
      res.status(StatusCodes.OK).json({
        komentar: komen,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        error: "Komentar not found",
      });
    }
  } catch (error) {}
};

router.get("/detail", getDetail);

module.exports = {
  getDetail,
  router,
};

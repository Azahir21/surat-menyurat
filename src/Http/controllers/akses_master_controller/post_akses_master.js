const express = require("express");
const { AKSES_MASTER } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postAksesMaster = async (req, res) => {
  const { permision_id, prodi, template, periode, fakultas, jabatan, jenis_surat, sikoja } = req.body;

  try {
    const latestAksesMaster = await AKSES_MASTER.findOne({
      order: [["id", "DESC"]],
    });

    const latestAksesMasterId = latestAksesMaster ? latestAksesMaster.id : 0;
    const newAksesMasterId = latestAksesMasterId + 1;

    const akses_master = await AKSES_MASTER.create({
      id: newAksesMasterId,
      permision_id,
      prodi,
      template,
      periode,
      fakultas,
      jabatan,
      jenis_surat,
      sikoja,
    });

    if (req.body.from) {
      return akses_master;
    } else {
      res.status(StatusCodes.CREATED).json({
        message: `created Akses Master successfully`,
        akses_master,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postAksesMaster);

module.exports = {
  postAksesMaster,
  router,
};

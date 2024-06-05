const express = require("express");
const { AKSES_MASTER, PERMISION } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putAksesMaster = async (req, res) => {
  try {
    const { prodi, template, periode, fakultas, jabatan, jenis_surat, sikoja } =
      req.body;
    const { jabatan_id } = req.query;
    if (!jabatan_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const permision = await PERMISION.findOne({
      where: { jabatan_id: jabatan_id },
    });

    const akses_master = await AKSES_MASTER.findOne({
      where: { permision_id: permision.id },
    });

    if (!akses_master) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "akses master not found" });
    }
    const akses_master_update = await AKSES_MASTER.update(
      {
        prodi,
        template,
        periode,
        fakultas,
        jabatan,
        jenis_surat,
        sikoja,
      },
      {
        where: { id: akses_master.id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ Akses_master: akses_master_update });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putAksesMaster);

module.exports = {
  putAksesMaster,
  router,
};

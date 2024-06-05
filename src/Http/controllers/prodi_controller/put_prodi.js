const express = require("express");
const { PRODI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putProdi = async (req, res) => {
  try {
    const { name, kode_prodi, fakultas_id } = req.body;
    const { prodi_id } = req.query;

    const prodi = await PRODI.findOne({
      where: { id: prodi_id },
    });

    if (!prodi_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const updateProdi = await PRODI.update(
      {
        name: name || prodi.name,
        kode_prodi: kode_prodi || prodi.kode_prodi,
        fakultas_id: fakultas_id || prodi.fakultas_id,
      },
      {
        where: { id: prodi_id },
        returning: true,
      }
    );

    if (updateProdi === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Prodi not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "success update",
      updateProdi,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putProdi);

module.exports = {
  putProdi,
  router,
};

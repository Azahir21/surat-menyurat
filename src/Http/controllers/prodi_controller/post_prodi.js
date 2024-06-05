const express = require("express");
const { PRODI, FAKULTAS } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postProdi = async (req, res) => {
  const { name, kode_prodi, fakultas_id } = req.body;
  try {
    const fakultas_name = await FAKULTAS.findOne({
      where: { id: fakultas_id },
    });

    if (!fakultas_name) {
      res.send("fakultas_id not found");
    }

    const latestProdi = await PRODI.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const latestProdiId = parseInt(latestProdi[0].id, 10);

    const prodi = await PRODI.create({
      id: latestProdiId + 1,
      name,
      kode_prodi,
      fakultas_id,
    });

    res.status(StatusCodes.CREATED).json({
      message: "created successfully",
      prodi,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postProdi);

module.exports = {
  postProdi,
  router,
};

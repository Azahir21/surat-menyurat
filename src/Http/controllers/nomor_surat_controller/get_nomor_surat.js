const express = require("express");
const {
  NOMOR_SURAT,
  PERIODE,
  DAFTAR_SURAT,
  USERS,
  JENIS_SURAT,
} = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getNomorSurat = async function (req, res) {
  try {
    let nomor_surat;
    const { nomor_surat_id } = req.query;
    if (!nomor_surat_id) {
      nomor_surat = await NOMOR_SURAT.findAll({
        attributes: ["id", "nomor_surat"],
        include: [
          {
            model: DAFTAR_SURAT,
            as: "daftar_surat",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: JENIS_SURAT,
                as: "jenis",
                attributes: ["id", "jenis"],
              },
              {
                model: USERS,
                as: "user",
                attributes: ["id", "email", "name"],
              },
            ],
          },
          {
            model: PERIODE,
            as: "periode",
            attributes: ["id", "tahun", "status"],
          },
        ],

        order: [["id", "ASC"]],
      });
    } else if (nomor_surat_id) {
      nomor_surat = await NOMOR_SURAT.findOne({
        attributes: ["nomor_surat"],
        include: [
          {
            model: DAFTAR_SURAT,
            as: "daftar_surat",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: JENIS_SURAT,
                as: "jenis",
                attributes: ["id", "jenis"],
              },
              {
                model: USERS,
                as: "user",
                attributes: ["id", "email", "name"],
              },
            ],
          },
          {
            model: PERIODE,
            as: "periode",
            attributes: ["id", "tahun", "status"],
          },
        ],

        order: [["id", "ASC"]],
      });
    }
    res.json(nomor_surat);
  } catch (error) {
    console.error("Error getting users:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.get("/", getNomorSurat);

module.exports = {
  getNomorSurat,
  router,
};

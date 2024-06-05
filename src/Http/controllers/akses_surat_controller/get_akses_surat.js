const express = require("express");
const {
  AKSES_SURAT,
  JABATAN,
  USERS,
  DAFTAR_SURAT,
  JENIS_SURAT,
} = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getAksesSurat = async (req, res) => {
  try {
    const { akses_surat_id } = req.query;
    let aksesSurat;

    if (!akses_surat_id) {
      aksesSurat = await AKSES_SURAT.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
                attributes: ["email", "name"],
              },
            ],
          },
          {
            model: JABATAN,
            as: "jabatan",
            attributes: ["id", "name"],
          },
        ],
      });
    } else if (akses_surat_id) {
      aksesSurat = await AKSES_SURAT.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
                attributes: ["email", "name"],
              },
            ],
          },
          {
            model: JABATAN,
            as: "jabatan",
            attributes: ["id", "name"],
          },
        ],
      });
    }
    res.json(aksesSurat);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
router.get("/", getAksesSurat);

module.exports = {
  router,
  getAksesSurat,
};

const express = require("express");
const { NOTIFIKASI, USERS, JABATAN, DAFTAR_SURAT, PRODI } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const app = express.Router();

const getNotif = async (req, res) => {
  try {
    let notifikasi;
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }

    if (user.prodi_id === 1 || !user.prodi_id) {
      notifikasi = await NOTIFIKASI.findAll({
        where: { jabatan_id_ke: user.jabatan_id },
        attributes: ["id", "pesan", "createdAt"],
        include: [
          {
            model: JABATAN,
            as: "pengirim",
            attributes: ["id", "name"],
          },
          {
            model: DAFTAR_SURAT,
            as: "surat",
            attributes: ["id", "judul"],
            include: [
              {
                model: USERS,
                as: "user",
                attributes: ["id", "name"],
                include: [
                  {
                    model: PRODI,
                    as: "prodi",
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      notifikasi = await NOTIFIKASI.findAll({
        where: {
          jabatan_id_ke: user.jabatan_id,
          "$surat.user.prodi.id$": user.prodi_id,
        },
        attributes: ["id", "pesan", "createdAt"],
        include: [
          {
            model: JABATAN,
            as: "pengirim",
            attributes: ["id", "name"],
          },
          {
            model: DAFTAR_SURAT,
            as: "surat",
            attributes: ["id", "judul"],
            include: [
              {
                model: USERS,
                as: "user",
                attributes: ["id", "name"],
                include: [
                  {
                    model: PRODI,
                    as: "prodi",
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }

    res.status(StatusCodes.OK).json(notifikasi);
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

app.get("/", getNotif);

module.exports = {
  getNotif,
  app,
};

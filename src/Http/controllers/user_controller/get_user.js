const express = require("express");
const { USERS, JABATAN, FAKULTAS, PRODI } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    let user;
    if (!user_id) {
      user = await USERS.findAll({
        include: [
          {
            model: PRODI,
            as: "prodi",
            attributes: {
              exclude: ["kode_prodi", "fakultas_id", "createdAt", "updatedAt"],
            },
          },
          {
            model: JABATAN,
            as: "jabatan",
            attributes: {
              exclude: ["jabatan_atas_id", "createdAt", "updatedAt"],
            },
            include: {
              model: JABATAN,
              as: "jabatan_atas",
              attributes: {
                exclude: ["jabatan_atas_id", "createdAt", "updatedAt"],
              },
            },
          },
          {
            model: FAKULTAS,
            as: "fakultas",
            attributes: {
              exclude: ["jenjang", "kode_fakultas", "createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: [
            "password",
            "jabatan_id",
            "prodi_id",
            "fakultas_id",
            "createdAt",
            "updatedAt",
          ],
        },
        order: [["id", "ASC"]],
      });
    } else {
      user = await USERS.findOne({
        where: { id: user_id },
        attributes: {
          exclude: [
            "password",
            "jabatan_id",
            "prodi_id",
            "fakultas_id",
            "createdAt",
            "updatedAt",
          ],
        },
        include: [
          {
            model: PRODI,
            as: "prodi",
            attributes: {
              exclude: ["kode_prodi", "fakultas_id", "createdAt", "updatedAt"],
            },
          },
          {
            model: JABATAN,
            as: "jabatan",
            attributes: {
              exclude: ["jabatan_atas_id", "createdAt", "updatedAt"],
            },
            include: {
              model: JABATAN,
              as: "jabatan_atas",
              attributes: {
                exclude: ["jabatan_atas_id", "createdAt", "updatedAt"],
              },
            },
          },
          {
            model: FAKULTAS,
            as: "fakultas",
            attributes: {
              exclude: ["jenjang", "kode_fakultas", "createdAt", "updatedAt"],
            },
          },
        ],
      });
    }

    if (!req.body.from) {
      res.status(StatusCodes.OK).json(user);
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error getting users:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.get("/", getUser);

module.exports = {
  router,
  getUser,
};

const express = require("express");
const { AKSES_MASTER, PERMISION, JABATAN } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getJabatan = async (req, res) => {
  try {
    const { jabatan_id } = req.query;

    if (!jabatan_id) {
      const allData = await JABATAN.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: PERMISION,
            as: "permision",
            attributes: { exclude: ["jabatan_id", "createdAt", "updatedAt"] },
            include: [
              {
                model: AKSES_MASTER,
                as: "akses_master",
                attributes: {
                  exclude: ["permision_id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: JABATAN,
            as: "jabatan_atas",
            attributes: {
              exclude: ["jabatan_id", "createdAt", "updatedAt"],
            },
          },
        ],
        order: [["id", "ASC"]],
      });
      res.send(allData);
    } else if (jabatan_id) {
      const findOneData = await JABATAN.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: PERMISION,
            as: "permision",
            attributes: {
              exclude: ["jabatan_id", "createdAt", "updatedAt"],
            },

            include: [
              {
                model: AKSES_MASTER,
                as: "akses_master",
                attributes: {
                  exclude: ["permision_id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: JABATAN,
            as: "jabatan_atas",
            attributes: {
              exclude: ["jabatan_id", "createdAt", "updatedAt"],
            },
          },
        ],
        order: [["id", "ASC"]],
        where: { id: jabatan_id },
      });
      if (req.query.from) {
        return findOneData;
      } else {
        if (findOneData) {
          res.send(findOneData);
        } else {
          res.status(StatusCodes.NOT_FOUND).json({ error: "Data not found" });
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.get("/", getJabatan);
module.exports = {
  getJabatan,
  router,
};

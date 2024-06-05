const express = require("express");
const { JABATAN } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putJabatan = async (req, res) => {
  try {
    const { name, jabatan_atas_id } = req.body;
    const { jabatan_id } = req.query;
    if (!jabatan_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid params" });
    }

    const jabatan = await JABATAN.findOne({ where: { id: jabatan_id } });

    if (!jabatan) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Jabatan not found" });
    }
    const jabatan_update = await JABATAN.update(
      {
        name,
        jabatan_atas_id: jabatan_atas_id || null,
      },
      {
        where: { id: jabatan_id },
        returning: true,
      }
    );

    res.json({ updatedName: jabatan_update[1][0].name + " success update" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.put("/", putJabatan);

module.exports = {
  putJabatan,
  router,
};

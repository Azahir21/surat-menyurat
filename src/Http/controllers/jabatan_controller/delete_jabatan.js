const express = require("express");
const { JABATAN, AKSES_MASTER, PERMISION, USERS, AKSES_SURAT } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteJabatan = async (req, res) => {
  try {
    const { jabatan_id } = req.query;

    if (!jabatan_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Parameter 'jabatan_id' is required" });
    }
    const users = await USERS.findAll({
      where: { jabatan_id: jabatan_id },
    });

    for (let user of users) {
      user.jabatan_id = null;
      await user.save();
    }
    const akses_surat = await AKSES_SURAT.findAll({
      where: { jabatan_id: jabatan_id },
    });
    for (let akseSurat of akses_surat) {
      akseSurat.jabatan_id = null;
      await akseSurat.save();
    }
    const permisions = await PERMISION.findAll({
      where: { jabatan_id: jabatan_id },
    });

    for (let permision of permisions) {
      await AKSES_MASTER.destroy({
        where: { permision_id: permision.id },
      });
    }

    await PERMISION.destroy({
      where: { jabatan_id: jabatan_id },
    });

    const deletedJabatan = await JABATAN.destroy({
      where: { id: jabatan_id },
    });

    if (deletedJabatan) {
      res.status(StatusCodes.OK).json({ message: "Jabatan deleted successfully" });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Jabatan not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteJabatan);

module.exports = {
  deleteJabatan,
  router,
};

const express = require("express");
const { PERMISION } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const putPermision = async (req, res) => {
  try {
    const {
      buat_surat,
      download_surat,
      generate_nomor_surat,
      upload_tandatangan,
      persetujuan,
      tagging,
    } = req.body;
    const { jabatan_id } = req.query;
    if (!jabatan_id) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Invalid params" });
    }

    const permision = await PERMISION.findOne({
      where: { jabatan_id: jabatan_id },
    });

    if (!permision) {
      return res.status(404).json({ error: "Permision not found" });
    }
    const permision_update = await PERMISION.update(
      {
        buat_surat,
        download_surat,
        generate_nomor_surat,
        upload_tandatangan,
        persetujuan,
        tagging,
      },
      {
        where: { jabatan_id: permision.jabatan_id },
        returning: true,
      }
    );

    res.status(StatusCodes.OK).json({ permision: permision_update });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.put("/", putPermision);

module.exports = {
  putPermision,
  router,
};

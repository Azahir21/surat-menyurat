const express = require("express");
const { AKSES_MASTER, PERMISION } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postPermision = async (req, res) => {
  const { jabatan_id, buat_surat, download_surat, generate_nomor_surat, upload_tandatangan, persetujuan, tagging } = req.body;
  try {
    const latestPermision = await AKSES_MASTER.findOne({
      order: [["id", "DESC"]],
    });
    const latestPermisionId = latestPermision ? latestPermision.id : 0;
    const newPermisionId = latestPermisionId + 1;

    const permision = await PERMISION.create({
      id: newPermisionId,
      jabatan_id,
      buat_surat,
      download_surat,
      generate_nomor_surat,
      upload_tandatangan,
      persetujuan,
      tagging,
    });
    if (req.body.from) {
      return permision;
    } else {
      res.status(StatusCodes.CREATED).json({
        message: `created permision successfully`,
        permision,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postPermision);

module.exports = {
  postPermision,
  router,
};

const express = require("express");
const { JABATAN } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const postJabatan = async (req, res) => {
  const { name, jabatan_atas_id } = req.body;
  try {
    const latestJabatan = await JABATAN.findOne({
      order: [["id", "DESC"]],
    });
    const latestJabatanId = latestJabatan ? latestJabatan.id : 0;
    const newJabatanId = latestJabatanId + 1;

    const jabatan = await JABATAN.create({
      id: newJabatanId,
      name,
      jabatan_atas_id: jabatan_atas_id || null,
    });
    res.status(StatusCodes.CREATED).json({ message: `${jabatan.name} created successfully` });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postJabatan);

module.exports = {
  postJabatan,
  router,
};

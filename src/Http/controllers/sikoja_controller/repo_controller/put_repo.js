const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const { REPO } = require("../../../../models");

const putRepo = async (req, res) => {
  const { surat_id } = req.query;

  const repo = await REPO.findOne({ where: { surat_id: surat_id } });

  const updatedRepo = await REPO.update(
    {
      visible: true,
    },
    {
      where: { surat_id: surat_id },
      returning: true,
    }
  );
  if (req.query.from) {
    return updatedRepo;
  }
  res.status(StatusCodes.OK).json(updatedRepo);
};

router.use("/", putRepo);

module.exports = { router, putRepo };

const express = require("express");
const router = express.Router();
const { STRATEGI } = require("../../../../models");
const { StatusCodes } = require("http-status-codes");

const putStrategi = async (req, res) => {
  const { strategi_id } = req.query;
  const { name } = req.body;

  const strategi = await STRATEGI.findOne({ where: { id: strategi_id } });

  const updatedStrategi = await strategi.update(
    {
      name: name || strategi.name,
    },
    {
      where: { id: strategi_id },
      returning: true,
    }
  );
  res.status(StatusCodes.OK).json(updatedStrategi);
};

router.use("/", putStrategi);

module.exports = { router, putStrategi };

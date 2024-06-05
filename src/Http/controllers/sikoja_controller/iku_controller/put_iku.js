const express = require("express");
const { IKU } = require("../../../../models/");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const putIku = async (req, res) => {
  try {
    const { iku_id } = req.query;
    const { name } = req.body;
    const dataIku = await IKU.findOne({
      where: { id: iku_id },
    });
    const putIku = await IKU.update(
      {
        name: name || dataIku.name,
      },
      {
        where: {
          id: iku_id,
        },
        returning: true,
      }
    );
    res.status(StatusCodes.OK).json({
      message: "iku updated successfully",
      putIku,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.put("/", putIku);

module.exports = { router, putIku };

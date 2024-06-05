const express = require("express");
const { STRATEGI } = require("../../../../models/");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const deleteStrategi = async (req, res) => {
  try {
    const { strategi_id } = req.query;
    const strategi = await STRATEGI.findByPk(strategi_id);

    if (!strategi) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Strategi not found" });
    }

    await STRATEGI.destroy({
      where: { id: strategi_id },
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Strategi deleted", strategi });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

router.delete("/", deleteStrategi);

module.exports = { deleteStrategi, router };

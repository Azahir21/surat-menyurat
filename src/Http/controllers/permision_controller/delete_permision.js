const express = require("express");
const { PERMISION } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deletePermision = async (req, res) => {
  try {
    const { permision_id } = req.query;

    if (!permision_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'permision_id' is required" });
    }

    const deletedPermision = await PERMISION.destroy({
      where: { id: permision_id },
    });

    if (deletedPermision) {
      res
        .status(StatusCodes.OK)
        .json({ message: "Permision deleted successfully" });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Permision not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deletePermision);

module.exports = {
  deletePermision,
  router,
};

const express = require("express");
const { STATUS } = require("../../../models");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const deleteStatus = async (req, res) => {
  try {
    const { status_id, surat_id } = req.query;

    const whereClause = {};
    if (req.query && status_id) {
      whereClause.id = status_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }

    const deletedStatus = await STATUS.destroy({
      where: whereClause,
    });

    if (deletedStatus) {
      if (!req.query.from) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Status deleted successfully" });
      } else {
        return deletedStatus;
      }
    } else {
      if (res) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Status not found" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/", deleteStatus);

module.exports = {
  deleteStatus,
  router,
};

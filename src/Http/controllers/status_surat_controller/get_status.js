const express = require("express");
const app = express.Router();
const { STATUS } = require("../../../models");
const { StatusCodes } = require("http-status-codes");

const getStatus = async (req, res) => {
  try {
    const { status_id, surat_id } = req.query;
    const whereClause = {};
    let status;

    if (req.query && status_id) {
      whereClause.id = status_id;
    }
    if (req.query && surat_id) {
      whereClause.surat_id = surat_id;
    }
    status = await STATUS.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    if (req.query.from) {
      return status;
    } else {
      res.status(StatusCodes.OK).json(status);
    }
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

app.get("/", getStatus);

module.exports = { getStatus, app };

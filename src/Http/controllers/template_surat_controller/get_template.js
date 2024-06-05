const express = require("express");
const { TEMPLATE_SURAT, JENIS_SURAT } = require("../../../models/index.js");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const getTemplate = async (req, res) => {
  try {
    const { template_id } = req.query;
    let template;

    if (!template_id) {
      template = await TEMPLATE_SURAT.findAll({
        include: [
          {
            model: JENIS_SURAT,
            as: "jenis",
            attributes: ["id", "jenis"],
          },
        ],
        order: [["id", "ASC"]],
      });
    } else {
      template = await TEMPLATE_SURAT.findOne({
        where: { id: template_id },
        include: [
          {
            model: JENIS_SURAT,
            as: "jenis",
            attributes: ["id", "jenis"],
          },
        ],
        order: [["id", "ASC"]],
      });
    }

    if (!req.body.from) {
      res.status(StatusCodes.OK).json(template);
    } else {
      return template;
    }
  } catch (error) {
    console.error("Error getting templates:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message || "An internal server error occurred.",
    });
  }
};

router.get("/", getTemplate);

module.exports = {
  getTemplate,
  router,
};

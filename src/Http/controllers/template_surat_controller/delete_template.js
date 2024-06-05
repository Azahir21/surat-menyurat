const express = require("express");
const { TEMPLATE_SURAT } = require("../../../models/index.js");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const deleteTemplate = async (req, res) => {
  try {
    const { template_id } = req.query;

    if (!template_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Parameter 'template_id' is required" });
    }
    const template = await TEMPLATE_SURAT.findOne({
      where: { id: template_id },
    });
    const deletedTemplate = await TEMPLATE_SURAT.destroy({
      where: { id: template_id },
    });

    if (deletedTemplate) {
      const templatePath = template.path;

      const filePath = path.join(
        __dirname,
        "../../../../",
        decodeURIComponent(templatePath)
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error:", err);
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Failed to delete file" });
        }

        res
          .status(StatusCodes.OK)
          .json({ message: "Template surat deleted successfully" });
      });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Template Surat not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

router.delete("/delete", deleteTemplate);

module.exports = { router, deleteTemplate };

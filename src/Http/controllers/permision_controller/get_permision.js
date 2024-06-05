const express = require("express");
const { PERMISION } = require("../../../models");
const router = express.Router();

const getPermision = async (req, res) => {
  try {
    const { permision_id } = req.query;

    if (!permision_id) {
      const allData = await PERMISION.findAll({
        order: [["id", "ASC"]],
      });
      res.send(allData);
    } else if (permision_id) {
      const findOneData = await PERMISION.findOne({
        where: { id: permision_id },
      });

      if (findOneData) {
        res.send(findOneData);
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid parameters" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.get("/", getPermision);
module.exports = {
  getPermision,
  router,
};

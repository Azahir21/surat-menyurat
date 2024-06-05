const multerController = require("./multer_controller/multer_controller.js");
const { getTemplate } = require("./get_template.js");
const { deleteTemplate } = require("./delete_template.js");
const express = require("express");
const app = express.Router();

app.use("/multer", multerController);
app.get("/", getTemplate);
app.delete("/delete", deleteTemplate);

module.exports = app;

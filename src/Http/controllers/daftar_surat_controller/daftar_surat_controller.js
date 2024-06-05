const multerController = require("./multer_controller/multer_controller");
const perbaikanController = require("./perbaikan_controller/perbaikan_controller");
const { deleteSurat } = require("./delete_daftar_surat");
const { getDaftarSurat } = require("./get_daftar_surat");

const express = require("express");
const app = express.Router();

app.get("/", getDaftarSurat);
app.use("/multer", multerController);
app.use("/multer", perbaikanController);
app.delete("/delete", deleteSurat);

module.exports = app;

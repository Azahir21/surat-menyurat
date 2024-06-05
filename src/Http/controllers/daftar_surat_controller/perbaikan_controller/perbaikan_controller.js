const express = require("express");
const app = express.Router();
const postPerbaikan = require("./post_perbaikan");
const deletePerbaikan = require("./delete_perbaikan").router;

app.use("/perbaikan", postPerbaikan);
app.use("/delete", deletePerbaikan);

module.exports = app;

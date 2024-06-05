const { getAksesSurat } = require("./get_akses_surat");
const { postAksesSurat } = require("./post_akses_surat");
const { putAksesSurat } = require("./put_akses_surat");
const { deleteAksesSurat } = require("./delete_akses_surat");

const express = require("express");
const app = express.Router();

app.get("/", getAksesSurat);
app.post("/", postAksesSurat);
app.put("/", putAksesSurat);
app.delete("/", deleteAksesSurat);

module.exports = app;

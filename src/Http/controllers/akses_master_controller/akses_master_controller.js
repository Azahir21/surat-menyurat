const { getAksesMaster } = require("./get_akses_master");
const { postAksesMaster } = require("./post_akses_master");
const { putAksesMaster } = require("./put_akses_master");
const { deleteAksesMaster } = require("./delete_akses_master");

const express = require("express");
const app = express.Router();

app.get("/", getAksesMaster);
app.post("/", postAksesMaster);
app.put("/", putAksesMaster);
app.delete("/", deleteAksesMaster);

module.exports = app;

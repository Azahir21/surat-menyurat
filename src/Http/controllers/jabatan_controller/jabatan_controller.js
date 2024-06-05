const { getJabatan } = require("./get_jabatan");
const { postJabatan } = require("./post_jabatan");
const {
  postJabatanPermisionAksesMaster,
} = require("./post_jabatan_permision_aksesMaster");
const { putJabatan } = require("./put_jabatan");
const { deleteJabatan } = require("./delete_jabatan");

const express = require("express");
const app = express.Router();

app.get("/", getJabatan);
app.post("/", postJabatan);
app.post("/postAll", postJabatanPermisionAksesMaster);
app.put("/", putJabatan);
app.delete("/", deleteJabatan);

module.exports = app;

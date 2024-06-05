const { getNomorSurat } = require("./get_nomor_surat");
const { postNomorSurat } = require("./post_nomor_surat");
const { deleteNomorSurat } = require("./delete_nomor_surat");

const express = require("express");
const app = express.Router();

app.get("/", getNomorSurat);
app.post("/", postNomorSurat);
app.delete("/", deleteNomorSurat);

module.exports = app;

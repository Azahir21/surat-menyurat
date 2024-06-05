const { getIndikator } = require("./get_indikator");
const { getIndikatorAll } = require("./get_indikator_all");
const { postIndikator } = require("./post_indikator");
const { putIndikator } = require("./put_indikator");
const { deleteIndikator } = require("./delete_indikator");

const express = require("express");
const app = express.Router();

app.get("/", getIndikatorAll);
app.post("/filter", getIndikator);
app.post("/", postIndikator);
app.put("/", putIndikator);
app.delete("/", deleteIndikator);

module.exports = app;

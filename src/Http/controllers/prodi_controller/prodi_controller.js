const { getProdi } = require("./get_prodi");
const { postProdi } = require("./post_prodi");
const { putProdi } = require("./put_prodi");
const { deleteProdi } = require("./delete_prodi");

const express = require("express");
const app = express.Router();

app.get("/", getProdi);
app.post("/", postProdi);
app.put("/", putProdi);
app.delete("/", deleteProdi);

module.exports = app;

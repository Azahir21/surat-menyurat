const { getAll } = require("./get_jenis");
const { postJenis } = require("./post_jenis");
const { putJenis } = require("./put_jenis");
const { deleteJenis } = require("./delete_jenis");

const express = require("express");
const app = express.Router();

app.get("/", getAll);
app.post("/", postJenis);
app.put("/", putJenis);
app.delete("/", deleteJenis);

module.exports = app;

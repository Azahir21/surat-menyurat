const { getFakultas } = require("./get_fakultas");
const { postFakultas } = require("./post_fakultas");
const { putFakultas } = require("./put_fakultas");
const { deleteFakultas } = require("./delete_fakultas");

const express = require("express");
const app = express.Router();

app.get("/", getFakultas);
app.post("/", postFakultas);
app.put("/", putFakultas);
app.delete("/", deleteFakultas);

module.exports = app;

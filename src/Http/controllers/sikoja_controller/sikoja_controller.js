const express = require("express");
const app = express.Router();
const iku = require("./iku_controller/iku_controller");
const indikator = require("./indikator_controller/indicator_controller");
const repo = require("./repo_controller/repo_controller");
const strategi = require("./strategi_controller/strategi_controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/iku", iku);
app.use("/indikator", indikator);
app.use("/repo", repo);
app.use("/strategi", strategi);

module.exports = app;

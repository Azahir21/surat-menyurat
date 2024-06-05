const { getPeriode } = require("./get_periode");
const { postPeriode } = require("./post_periode");
const { putPeriodeTahun } = require("./put_periode_tahun");
const { putPeriodeStatus } = require("./put_periode_status");
const { deletePeriode } = require("./delete_periode");

const express = require("express");
const app = express.Router();

app.get("/", getPeriode);
app.post("/", postPeriode);
app.put("/tahun", putPeriodeTahun);
app.put("/status", putPeriodeStatus);
app.delete("/", deletePeriode);

module.exports = app;

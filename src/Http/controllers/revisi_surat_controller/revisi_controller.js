const express = require("express");
const app = express.Router();
const { postRevisi } = require("./post_revisi");

app.use("/", postRevisi);

module.exports = app;

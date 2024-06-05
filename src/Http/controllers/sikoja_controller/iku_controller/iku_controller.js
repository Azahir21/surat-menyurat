const { getIku } = require("./get_iku");
const { postIku } = require("./post_iku");
const { putIku } = require("./put_iku");
const { deleteIku } = require("./delete_iku");

const express = require("express");
const app = express.Router();

app.get("/", getIku);
app.post("/", postIku);
app.put("/", putIku);
app.delete("/", deleteIku);

module.exports = app;

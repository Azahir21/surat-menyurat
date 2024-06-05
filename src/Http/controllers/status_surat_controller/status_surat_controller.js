const express = require("express");
const app = express.Router();
const { postStatus } = require("./post_status");
const { putStatus } = require("./put_status");
const { getStatus } = require("./get_status");
const { deleteStatus } = require("./delete_status");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postStatus);
app.put("/", putStatus);
app.get("/", getStatus);
app.delete("/", deleteStatus);

module.exports = app;

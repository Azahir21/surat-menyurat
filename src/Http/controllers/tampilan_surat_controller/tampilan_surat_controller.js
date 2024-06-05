const express = require("express");
const app = express.Router();
const { postTampilan } = require("./post_tampilan");
const { putTampilan } = require("./put_tampilan");
const { getTampilan } = require("./get_tampilan");
const { deleteTampilan } = require("./delete_tampilan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postTampilan);
app.get("/", getTampilan);
app.put("/update", putTampilan);
app.delete("/delete", deleteTampilan);

module.exports = app;

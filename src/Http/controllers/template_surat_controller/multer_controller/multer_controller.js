const express = require("express");
const app = express.Router();
const getDownload = require("./get_multer_download");
const postMulter = require("./post_multer_upload");
const getDetail = require("./get_multer_detail").router;
const putMulter = require("./put_multer_update");

app.use("/download", getDownload);
app.use("/upload", postMulter);
app.use("/detail", getDetail);
app.use("/update", putMulter);

module.exports = app;

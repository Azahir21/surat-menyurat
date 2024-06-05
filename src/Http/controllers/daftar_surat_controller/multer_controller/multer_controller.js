const express = require("express");
const app = express.Router();
const getDownload = require("./get_multer_download");
const postMulter = require("./post_multer_upload");
const postPembetulan = require("./post_multer_pembetulan");
const getDetail = require("./get_multer_detail").router;
const putMulterTtd = require("./put_multer_ttd");

app.use("/download", getDownload);
app.use("/upload", postMulter);
app.use("/pembetulan", postPembetulan);
app.use("/detail", getDetail);
app.use("/ttd", putMulterTtd);

module.exports = app;

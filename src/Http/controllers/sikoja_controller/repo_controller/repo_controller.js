const express = require("express");
const app = express.Router();
const { postRepo } = require("./post_repo");
const { getRepo } = require("./get_repo_all.js");
const { getRepoDetail } = require("./get_repo_detail.js");
const { putRepo } = require("./put_repo.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", postRepo);
app.post("/filter", getRepo);
app.get("/detail", getRepoDetail);
app.put("/", putRepo);

module.exports = app;

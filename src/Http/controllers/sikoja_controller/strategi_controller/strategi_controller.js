const express = require("express");
const app = express.Router();
const { getStrategi } = require("./get_strategi");
const { postStrategi } = require("./post_strategi");

const { putStrategi } = require("./put_strategi");
const { deleteStrategi } = require("./delete_strategi");

app.get("/", getStrategi);
app.post("/", postStrategi);
app.put("/", putStrategi);
app.delete("/", deleteStrategi);

module.exports = app;

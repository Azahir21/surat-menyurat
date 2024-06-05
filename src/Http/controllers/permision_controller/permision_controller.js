const { getPermision } = require("./get_permision");
const { postPermision } = require("./post_permision");
const { putPermision } = require("./put_permision");
const { deletePermision } = require("./delete_permision");

const express = require("express");
const app = express.Router();

app.get("/", getPermision);
app.post("/", postPermision);
app.put("/", putPermision);
app.delete("/", deletePermision);

module.exports = app;

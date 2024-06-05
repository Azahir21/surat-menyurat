const { getUser } = require("./get_user");
const { putUserPass } = require("./put_user_password");
const { deleteUser } = require("./delete_user");
const { putUser } = require("./put_user");

const express = require("express");
const app = express.Router();

app.get("/", getUser);
app.put("/", putUser);
app.put("/password", putUserPass);
app.delete("/", deleteUser);

module.exports = app;

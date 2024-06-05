const { postLogin } = require("./post_auth_login");
const { postRegister } = require("./post_auth_register");
const { putAktivasi } = require("./put_auth_aktivasi");
const { putResetPassword } = require("./put_auth_reset_pass");

const express = require("express");
const app = express.Router();

app.post("/login", postLogin);
app.post("/register", postRegister);
app.put("/aktivasi", putAktivasi);
app.put("/reset-password", putResetPassword);

module.exports = app;

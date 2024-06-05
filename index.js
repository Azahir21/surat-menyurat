const express = require("express");

const app = express();

require("dotenv").config();
require("pg");
const router = require("./src/routes/index.js");
const zip = require("express-easy-zip");

app.use(express.json());
app.use(zip());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log("%s is running on port %s", process.env.LINK, process.env.PORT);

  console.log(`${process.env.LINK} on port ${process.env.PORT}`);
});

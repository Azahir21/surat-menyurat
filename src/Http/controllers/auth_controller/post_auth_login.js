const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { USERS, JABATAN, PRODI, FAKULTAS } = require("../../../models/index.js");
const config = require("../../../../config/config.js");
const jwt = require("jsonwebtoken");
const express = require("express");
const { getJabatan } = require("../jabatan_controller/get_jabatan.js");
const router = express.Router();
const sequelize = require("sequelize");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const environment = "development";
const secretKey = config[environment].secret_key;

const postLogin = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email: ", email);
    const user = await USERS.findOne({
      where: {
        email: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          email.toLowerCase()
        ),
      },
    });

    if (user && !user.aktif) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User is not active" });
    }
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign({ id: user.id, aktif: user.aktif }, secretKey, {
        expiresIn: "7d",
      });
      const searchUser = await USERS.findOne({
        where: { id: user.id },
      });

      const user_response = await USERS.findOne({
        include: [
          {
            model: PRODI,
            as: "prodi",
            attributes: ["id", "name"],
          },
          {
            model: JABATAN,
            as: "jabatan",
            attributes: {
              exclude: ["jabatan_atas_id", "createdAt", "UpdatedAt"],
            },
            where: { id: searchUser.jabatan_id },
          },
          {
            model: FAKULTAS,
            as: "fakultas",
            attributes: ["id", "name"],
          },
        ],
        attributes: ["id", "name", "email", "aktif"],
        where: { email: req.body.email },
      });

      const reqJabatan = {
        query: {
          jabatan_id: user.jabatan_id,
          from: `auth_controller/post_auth_login.js`,
        },
      };
      const saveJabatan = await getJabatan(reqJabatan);
      res.json({
        message: "Login Berhasil",
        token,
        user_response,
        jabatan: saveJabatan,
      });
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid login credentials" });
    }
  } catch (error) {
    console.log("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

router.post("/login", postLogin);
module.exports = {
  router,
  postLogin,
};

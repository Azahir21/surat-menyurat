const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { USERS } = require("../../../models/index.js");
const crypto = require("crypto");
const authMiddleware = require("../../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

const putResetPassword =
  (authMiddleware,
  async (req, res) => {
    try {
      const { user_id } = req.query;
      if (user_id == 1) {
        res.json("Error : The User is Admin");
      }
      const password = crypto.randomBytes(10).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);
      const updated = await USERS.update(
        { password: hashedPassword },
        {
          where: { id: user_id },
        }
      );
      const search_user = await USERS.findOne({
        where: { id: user_id },
        attributes: ["id", "email", "password"],
      });
      let user = search_user;
      user.password = password;

      if (updated) {
        res.json({ message: "Password reset successfully", user });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  });

router.put("/reset-password", authMiddleware, putResetPassword);

module.exports = {
  router,
  putResetPassword,
};

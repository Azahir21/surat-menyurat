const { StatusCodes } = require("http-status-codes");
const { USERS } = require("../../../models/index.js");
const authMiddleware = require("../../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

const putAktivasi =
  (authMiddleware,
  async (req, res) => {
    try {
      const { aktif } = req.body;
      const { user_id } = req.query;
      if (user_id == 1) {
        return res.json("Error : The User is Admin");
      }
      const [updated] = await USERS.update(
        { aktif },
        {
          where: { id: user_id },
        }
      );
      let message;
      if (updated) {
        if (aktif === `true`) {
          message = "User activated successfully";
        } else {
          message = "User deactivated successfully";
        }
        res.json({ message });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  });

router.put("/aktivasi", authMiddleware, putAktivasi);

module.exports = {
  router,
  putAktivasi,
};

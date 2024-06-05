const express = require("express");
const app = express.Router();
const router = express.Router();
const { TAMPILAN, DAFTAR_SURAT, USERS, JABATAN } = require("../../../models");
const { putStatus } = require("../status_surat_controller/put_status");
const { StatusCodes } = require("http-status-codes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const putTampilan = async (req, res) => {
  try {
    const { pin, dibaca } = req.body;
    const { surat_id } = req.query;
    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    const tampilan = await TAMPILAN.update(
      {
        pin: pin,
        dibaca: dibaca,
      },
      {
        where: {
          surat_id: surat_id,
          jabatan_id: user.jabatan_id,
        },
        returning: true,
      }
    );

    let saveStatus;
    if (dibaca) {
      const reqStatus = {
        body: {
          dibaca: dibaca,
          user: user,
          from: "tampilan_surat_controller",
        },
        query: {
          surat_id: surat_id,
        },
        token: req.token,
      };
      saveStatus = await putStatus(reqStatus);
      const surat = await DAFTAR_SURAT.findOne({
        where: { id: surat_id },
      });
      const user_surat = await USERS.findOne({
        where: { id: surat.user_id },
      });
    }
    if (!req.body.from) {
      res.status(StatusCodes.OK).json({ tampilan, saveStatus });
    } else {
      return { tampilan, saveStatus };
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.put("/update", putTampilan);

module.exports = {
  router,
  putTampilan,
  app,
};

const express = require("express");
const app = express.Router();
const router = express.Router();
const { STATUS, DAFTAR_SURAT, USERS, JABATAN } = require("../../../models");
const catchStatus = require("./catch_status");
const { StatusCodes } = require("http-status-codes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postStatus = async (req, res) => {
  try {
    const { surat_id } = req.body;
    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const user = await USERS.findOne({
      where: { id: req.body.user_id || req.token.id },
    });

    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });
    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }
    const reqStatus = {
      body: {
        jabatan_id: jabatan.id,
        isRead: false,
        latestStatus: "",
        persetujuan: "",
        isSigned: false,
      },
    };

    const saveStatus = await catchStatus(reqStatus);
    const surat_kesetujuan = await STATUS.create({
      surat_id: surat.id,
      persetujuan: "",
      status: saveStatus,
    });
    if (!req.body.from) {
      res.status(StatusCodes.OK).json({ surat: surat_kesetujuan });
    } else {
      return { surat_kesetujuan };
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

router.post("/awal", postStatus);

module.exports = {
  router,
  postStatus,
  app,
};

const express = require("express");
const app = express.Router();
const {
  STATUS,
  DAFTAR_SURAT,
  USERS,
  JABATAN,
  PERMISION,
  REVISI,
  NOMOR_SURAT,
} = require("../../../models");
const catchStatus = require("./catch_status");
const { StatusCodes } = require("http-status-codes");
const {
  postTampilan,
} = require("./../tampilan_surat_controller/post_tampilan");
const {
  postNomorSurat,
} = require("./../nomor_surat_controller/post_nomor_surat");
const { postNotif } = require("../notifikasi_controller/post_notifikasi");
const {
  postAksesSurat,
} = require("../akses_surat_controller/post_akses_surat");
const {
  postNomorSuratRevisi,
} = require("../nomor_surat_controller/post_nomor_surat_revisi");
const { postRepo } = require("../sikoja_controller/repo_controller/post_repo");
const {
  getProgressBar,
} = require("../daftar_surat_controller/multer_controller/get_progress_bar");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const putStatus = async (req, res) => {
  try {
    let reqTampilan, updateStatus, reqStatus, reqNomorSuratRevisi;
    const { persetujuan, status, indikator_id } = req.body;
    const { surat_id } = req.query;

    const user = await USERS.findOne({
      where: { id: req.token.id },
    });
    const jabatan = await JABATAN.findOne({
      where: { id: user.jabatan_id },
    });

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const user_surat = await USERS.findOne({
      where: { id: surat.user_id },
    });
    const status_surat = await STATUS.findOne({
      where: { surat_id: surat.id },
    });
    if (!status_surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Status not found",
      });
    }

    if (!surat) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Daftar surat not found",
      });
    }

    if (req.body.from) {
      //diproses/dibaca
      reqStatus = {
        body: {
          jabatan_id: user.jabatan_id,
          isRead: req.body.dibaca,
          latestStatus: status_surat.status,
          persetujuan: persetujuan,
          isSigned: req.body.isSigned,
        },
      };
    } else {
      reqStatus = {
        body: {
          jabatan_id: jabatan.id,
          isRead: req.body.dibaca,
          latestStatus: status_surat.status,
          persetujuan: persetujuan,
        },
      };
    }
    const saveStatus = await catchStatus(reqStatus);

    if (!persetujuan) {
      updateStatus = await STATUS.update(
        {
          status: saveStatus || status || status_surat.status,
        },
        {
          where: { surat_id: surat.id ? surat.id : surat_id },
          returning: true,
        }
      );
    } else {
      updateStatus = await STATUS.update(
        {
          persetujuan: persetujuan || status_surat.persetujuan || "",
          status: saveStatus || status || status_surat.status,
        },
        {
          where: { surat_id: surat.id ? surat.id : surat_id },
          returning: true,
        }
      );
    }

    const reqNotif = {
      body: {
        surat_id: surat_id,
        jabatan_id_dari: jabatan.id,
        jabatan_id_ke: user_surat.jabatan_id,
        isSign: false,
        persetujuan: persetujuan,
        from: `status_surat_controller/put_status`,
      },
    };
    await postNotif(reqNotif);

    if (persetujuan && persetujuan.toLowerCase().includes("disetujui")) {
      if (jabatan.jabatan_atas_id) {
        reqTampilan = {
          body: {
            jabatan_id: jabatan.jabatan_atas_id,
            surat_id: surat_id,
            from: "status_surat_controller",
          },
          token: req.token,
        };
        await postTampilan(reqTampilan);
        reqAkses = {
          body: {
            surat_id: surat.id,
            tambah_akses_id: jabatan.jabatan_atas_id || "",
            from: `status_surat_controller/put_status.js`,
          },
        };
        await postAksesSurat(reqAkses);
        const reqNotif2 = {
          body: {
            surat_id: surat_id,
            jabatan_id_dari: jabatan.id,
            jabatan_id_ke: jabatan.jabatan_atas_id,
            isSign: false,
            persetujuan: false,
            from: `status_surat_controller/put_status`,
          },
        };
        await postNotif(reqNotif2);
      }

      const permision = await PERMISION.findOne({
        where: { jabatan_id: jabatan.id },
      });
      if (permision.generate_nomor_surat) {
        let surat_revisi = await REVISI.findOne({
          where: { surat_id_baru: surat_id },
        });

        let nomor_surat = null;
        let i = 0,
          j = 0;
        if (surat_revisi) {
          do {
            if (surat_revisi) {
              nomor_surat = await NOMOR_SURAT.findOne({
                where: { surat_id: surat_revisi.surat_id_lama },
              });
            }
            if (!surat_revisi) {
              break;
            }
            surat_revisi = await REVISI.findOne({
              where: { surat_id_baru: surat_revisi?.surat_id_lama || 0 },
            });
          } while (!nomor_surat);
        }
        if (!surat_revisi || (!surat_revisi && !nomor_surat)) {
          await postNomorSurat(reqTampilan);
        } else {
          await postNomorSuratRevisi(reqTampilan);
        }
      }
      if (permision.tagging) {
        if (!indikator_id) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Indikator ID is required" });
        }
        const reqRepo = {
          body: {
            surat_id: surat_id,
            indikator_id: indikator_id,
            from: `status_surat_controller/put_status.js`,
          },
        };
        await postRepo(reqRepo);
      }
    }

    const progressBarRes = await getProgressBar(
      {
        query: {
          surat_id: surat_id,
          from: `daftar_surat_controller/multer_controller/post_multer_upload`,
        },
      },
      {}
    );

    if (req.body.from) {
      return updateStatus;
    } else {
      res.status(StatusCodes.OK).json({ surat: updateStatus });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

app.put("/update", putStatus);

module.exports = {
  putStatus,
  app,
};

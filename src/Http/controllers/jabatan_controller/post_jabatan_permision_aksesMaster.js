const express = require("express");
const { JABATAN } = require("../../../models");
const { StatusCodes } = require("http-status-codes");
const { postPermision } = require("../permision_controller/post_permision");
const { postAksesMaster } = require("../akses_master_controller/post_akses_master");
const { getJabatan } = require("./get_jabatan");
const router = express.Router();

const postJabatanPermisionAksesMaster = async (req, res) => {
  const { name, jabatan_atas_id, buat_surat, download_surat, generate_nomor_surat, upload_tandatangan, persetujuan, tagging, prodi, template, periode, fakultas, jabatan, jenis_surat, sikoja } = req.body;
  try {
    const latestJabatan = await JABATAN.findOne({
      order: [["id", "DESC"]],
    });
    const latestJabatanId = latestJabatan ? latestJabatan.id : 0;
    const newJabatanId = latestJabatanId + 1;

    const saveJabatan = await JABATAN.create({
      id: newJabatanId,
      name,
      jabatan_atas_id: jabatan_atas_id || null,
    });

    const reqPermision = {
      body: {
        from: `jabatan_controller/post_jabatan_permision_aksesMaster`,
        jabatan_id: saveJabatan.id,
        buat_surat,
        download_surat,
        generate_nomor_surat,
        upload_tandatangan,
        persetujuan,
        tagging,
      },
    };
    const savePermision = await postPermision(reqPermision);

    const reqAksesMaster = {
      body: {
        from: `jabatan_controller/post_jabatan_permision_aksesMaster`,
        permision_id: savePermision.id,
        prodi,
        template,
        periode,
        fakultas,
        jabatan,
        jenis_surat,
        sikoja,
      },
    };
    const saveAksesMaster = await postAksesMaster(reqAksesMaster);

    const reqJabatan = {
      query: {
        from: `jabatan_controller/post_jabatan_permision_aksesMaster`,
        jabatan_id: saveJabatan.id,
      },
    };
    const getDataJabatan = await getJabatan(reqJabatan);

    res.status(StatusCodes.CREATED).json({
      message: " created successfully",
      getDataJabatan,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

router.post("/", postJabatanPermisionAksesMaster);

module.exports = {
  postJabatanPermisionAksesMaster,
  router,
};

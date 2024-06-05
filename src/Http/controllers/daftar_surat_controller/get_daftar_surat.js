const express = require("express");
const router = express.Router(); //
const { DAFTAR_SURAT, USERS, JABATAN, PRODI, FAKULTAS, STATUS, TAMPILAN, AKSES_SURAT, JENIS_SURAT, KOMENTAR, NOMOR_SURAT, PERIODE, PERBAIKAN } = require("../../../models");
const { Op } = require("sequelize");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const getDaftarSurat = async (req, res) => {
  let surat;
  const { startDate, endDate } = req.query;
  const { repo } = req.query;
  const { prodi_id } = req.query;

  let dateFilter = {};
  if (startDate) {
    const start = new Date(startDate);
    dateFilter[Op.gte] = start;
  }

  let end;
  if (endDate) {
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter[Op.lte] = end;
  }
  const user = await USERS.findOne({
    where: { id: req.token.id },
  });
  const jabatan = await JABATAN.findOne({
    where: { id: user.jabatan_id },
  });
  const prodi = await PRODI.findOne({
    where: { id: user.prodi_id },
  });
  const fakultas = await FAKULTAS.findOne({
    where: { id: user.fakultas_id },
  });

  const whereClause =
    startDate && endDate
      ? {
          tanggal: {
            [Op.between]: [new Date(startDate), end],
          },
        }
      : {};

  if (req.query && startDate !== undefined) {
    const start = new Date(startDate);
    let end;
    if (endDate) {
      end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      end.setMilliseconds(end.getMilliseconds() - 1);
    }
  }

  if (!fakultas.id || fakultas.name == `-` || fakultas.id == 1) {
    //super admin
    surat = await DAFTAR_SURAT.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        ...whereClause,
      },
      include: [
        {
          model: STATUS,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        {
          model: JENIS_SURAT,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: KOMENTAR,
          as: "komentar",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: NOMOR_SURAT,
          as: "nomor_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
          include: [
            {
              model: PERIODE,
              as: "periode",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: USERS,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: PRODI,
              as: "prodi",
              attributes: ["id", "name"],
            },
            {
              model: JABATAN,
              as: "jabatan",
              attributes: ["id", "name"],
            },
            {
              model: FAKULTAS,
              as: "fakultas",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  } else if (!prodi.id || prodi.name == `-` || prodi.id == 1) {
    surat = await DAFTAR_SURAT.findAll({
      //by fakultas / bukan oleh prodi
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        ...whereClause,
        visible: true,
      },
      include: [
        {
          model: STATUS,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        {
          model: TAMPILAN,
          as: "tampilan",
          attributes: ["pin", "dibaca"],
          where: { jabatan_id: jabatan.id },
        },
        {
          model: JENIS_SURAT,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: AKSES_SURAT,
          as: "akses_surat",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { jabatan_id: user.jabatan_id },
        },
        {
          model: KOMENTAR,
          as: "komentar",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: PERBAIKAN,
          as: "perbaikan",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: NOMOR_SURAT,
          as: "nomor_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          include: [
            {
              model: PERIODE,
              as: "periode",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: USERS,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: PRODI,
              as: "prodi",
              attributes: ["id", "name"],
            },
            {
              model: JABATAN,
              as: "jabatan",
              attributes: ["id", "name"],
            },
            {
              model: FAKULTAS,
              as: "fakultas",
              attributes: ["id", "name"],
              where: { id: fakultas.id },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  } else {
    surat = await DAFTAR_SURAT.findAll({
      //by prodi
      attributes: { exclude: [, "createdAt", "updatedAt"] },
      where: {
        "$user.prodi.id$": prodi.id,
        ...whereClause,
        visible: true,
      },
      include: [
        {
          model: STATUS,
          as: "status",
          attributes: ["status", "persetujuan"],
        },
        {
          model: TAMPILAN,
          as: "tampilan",
          attributes: ["pin", "dibaca"],
          where: { jabatan_id: jabatan.id },
        },
        {
          model: JENIS_SURAT,
          as: "jenis",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: AKSES_SURAT,
          as: "akses_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          where: { jabatan_id: user.jabatan_id },
        },
        {
          model: KOMENTAR,
          as: "komentar",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: PERBAIKAN,
          as: "perbaikan",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          required: false,
        },
        {
          model: NOMOR_SURAT,
          as: "nomor_surat",
          attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
          include: [
            {
              model: PERIODE,
              as: "periode",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: USERS,
          as: "user",
          attributes: ["email", "name"],
          include: [
            {
              model: PRODI,
              as: "prodi",
              attributes: ["id", "name"],
              where: { id: prodi.id },
            },
            {
              model: JABATAN,
              as: "jabatan",
              attributes: ["id", "name"],
              where: { id: jabatan.id },
            },
            {
              model: FAKULTAS,
              as: "fakultas",
              attributes: ["id", "name"],
              where: { id: fakultas.id },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  }
  res.json(surat);
};

router.get("/", getDaftarSurat);

module.exports = {
  router,
  getDaftarSurat,
};

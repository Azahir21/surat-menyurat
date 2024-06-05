const express = require("express");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const { REPO, DAFTAR_SURAT, NOMOR_SURAT, STATUS, JENIS_SURAT, PERIODE, USERS, KOMENTAR, JABATAN, PRODI, FAKULTAS, PERBAIKAN, INDIKATOR, STRATEGI, IKU } = require("../../../models/");
const { Op } = require("sequelize");
const router = express.Router();
const ExcelJS = require("exceljs");

router.post(`/`, async (req, res) => {
  const { repo_id } = req.body;
  let whereClause = {};
  let repo;
  if (repo_id && repo_id.length > 0) {
    whereClause.id = {
      [Op.in]: repo_id,
    };
    repo = await REPO.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
      attributes: { exclude: ["indikator_id", "surat_id"] },
      include: [
        {
          model: INDIKATOR,
          as: "indikator",
          attributes: {
            exclude: ["iku_id", "strategi_id", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: STRATEGI,
              as: "strategi",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: IKU,
              as: "iku",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
        {
          model: DAFTAR_SURAT,
          as: "surat",
          attributes: { exclude: [, "createdAt", "updatedAt"] },
          order: [["id", "ASC"]],
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
            },
            {
              model: PERBAIKAN,
              as: "perbaikan",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
            },
            {
              model: NOMOR_SURAT,
              as: "nomor_surat",
              attributes: { exclude: ["surat_id", "createdAt", "updatedAt"] },
              order: [["id", "ASC"]],
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
        },
      ],
    });
    repo = JSON.parse(JSON.stringify(repo));
  }

  let counter = 1;
  const workbook = new ExcelJS.Workbook();
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.creator = "system";
  const worksheet = workbook.addWorksheet("Sheet1", {
    properties: { tabColor: { argb: "FFC0000" } },
  });

  worksheet.columns = [
    { header: "NO", key: "no", width: 5, height: 20 },
    { header: "TIMESTAMP", key: "timestamp", width: 16 },
    { header: "NOMOR SURAT TUGAS", key: "nomor_surat_tugas", width: 31 },
    { header: "JUDUL SURAT TUGAS", key: "judul_surat_tugas", width: 32 },
    { header: "PROGRAM STUDI", key: "program_studi", width: 30 },
    { header: "NOMOR IKU", key: "nomer_iku", width: 16 },
    { header: "INDIKATOR", key: "indikator", width: 60 },
    { header: "CATATAN", key: "catatan", width: 30 },
    { header: "LINK", key: "link", width: 35 },
  ];

  repo.forEach((row, index) => {
    let timestamp = new Date(row.createdAt);
    timestamp = `${timestamp.getDate().toString().padStart(2, "0")}/${(timestamp.getMonth() + 1).toString().padStart(2, "0")}/${timestamp.getFullYear()}`;

    worksheet.addRow({
      no: index + 1,
      timestamp: timestamp,
      nomor_surat_tugas: row.surat.nomor_surat[0].nomor_surat,
      judul_surat_tugas: row.surat.judul,
      program_studi: row.surat.user.prodi.name != "-" ? row.surat.user.prodi.name : row.surat.user.jabatan.name,
      nomer_iku: row.indikator.id,
      indikator: row.indikator.name,
      catatan: row.surat.deskripsi,
      link: `${process.env.LINK}/${row.unix_code}`,
    });
    counter++;
  });

  const columnAlignments = [
    {
      column: 1,
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
    },
    {
      column: 2,
      alignment: { vertical: "middle", horizontal: "right", wrapText: true },
    },
    { column: 3, alignment: { vertical: "middle", wrapText: true } },
    { column: 4, alignment: { vertical: "middle", wrapText: true } },
    {
      column: 5,
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
    },
    {
      column: 6,
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
    },
    { column: 7, alignment: { vertical: "middle", wrapText: true } },
    {
      column: 8,
      alignment: { vertical: "middle", horizontal: "center", wrapText: true },
    },
    { column: 9, alignment: { vertical: "middle", wrapText: true } },
  ];
  columnAlignments.forEach(({ column, alignment }) => {
    worksheet.getColumn(column).alignment = alignment;
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.style.font;
    cell.font = { size: 15, name: "Calibri" };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9900" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  worksheet.getRow(1).height = 40;
  for (let i = 2; i <= counter; i++) {
    worksheet.getRow(i).eachCell((cell) => {
      cell.font = { size: 11, name: "Courier New" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    worksheet.getCell(`I${i}`).value = {
      text: worksheet.getCell(`I${i}`).value,
      hyperlink: worksheet.getCell(`I${i}`).value,
    };
  }

  const tempDir = path.resolve("export/");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const filePath = path.join(tempDir, "archive.xlsx");

  await workbook.xlsx.writeFile(filePath);
  res.download(filePath);
});

module.exports = router;

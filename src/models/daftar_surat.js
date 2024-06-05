"use strict";
const { Model } = require("sequelize");
const komentar = require("./komentar");
module.exports = (sequelize, DataTypes) => {
  class DAFTAR_SURAT extends Model {
    static associate(models) {
      DAFTAR_SURAT.belongsTo(models.USERS, {
        foreignKey: "user_id",
        as: "user",
      });
      DAFTAR_SURAT.belongsTo(models.JENIS_SURAT, {
        foreignKey: "jenis_id",
        as: "jenis",
      });
      DAFTAR_SURAT.hasMany(models.KOMENTAR, {
        foreignKey: "surat_id",
        as: "komentar",
      });
      DAFTAR_SURAT.hasMany(models.NOTIFIKASI, {
        foreignKey: "surat_id",
        as: "notifikasi",
      });
      DAFTAR_SURAT.hasMany(models.NOMOR_SURAT, {
        foreignKey: "surat_id",
        as: "nomor_surat",
      });
      DAFTAR_SURAT.hasMany(models.TAMPILAN, {
        as: "tampilan",
        foreignKey: "surat_id",
      });
      DAFTAR_SURAT.hasOne(models.STATUS, {
        as: "status",
        foreignKey: "surat_id",
      });
      DAFTAR_SURAT.hasMany(models.AKSES_SURAT, {
        foreignKey: "surat_id",
        as: "akses_surat",
      });
      DAFTAR_SURAT.hasMany(models.REVISI, {
        foreignKey: "surat_id_lama",
        as: "surat_id_old",
      });
      DAFTAR_SURAT.hasMany(models.REVISI, {
        foreignKey: "surat_id_baru",
        as: "surat_id_new",
      });
      DAFTAR_SURAT.hasMany(models.PERBAIKAN, {
        foreignKey: "surat_id",
        as: "perbaikan",
      });
    }
  }
  DAFTAR_SURAT.init(
    {
      judul: DataTypes.STRING,
      jenis_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "JENIS_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "USERS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deskripsi: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      path: DataTypes.STRING,
      progressBar: DataTypes.INTEGER,
      visible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DAFTAR_SURAT",
      tableName: "DAFTAR_SURATS",
    }
  );
  return DAFTAR_SURAT;
};

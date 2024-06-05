"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AKSES_SURAT extends Model {
    static associate(models) {
      AKSES_SURAT.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
      AKSES_SURAT.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_id",
        as: "jabatan",
      });
    }
  }
  AKSES_SURAT.init(
    {
      surat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      jabatan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "JABATAN",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "AKSES_SURAT",
      tableName: "AKSES_SURATS",
    }
  );
  return AKSES_SURAT;
};

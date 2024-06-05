"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NOMOR_SURAT extends Model {
    static associate(models) {
      NOMOR_SURAT.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
      NOMOR_SURAT.belongsTo(models.PERIODE, {
        foreignKey: "periode_id",
        as: "periode",
      });
    }
  }
  NOMOR_SURAT.init(
    {
      nomor_surat: DataTypes.STRING,
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
      periode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PERIODE",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "NOMOR_SURAT",
      tableName: "NOMOR_SURATS",
    }
  );
  return NOMOR_SURAT;
};

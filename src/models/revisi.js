"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class REVISI extends Model {
    static associate(models) {
      REVISI.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id_lama",
        as: "surat_id_old",
      });
      REVISI.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id_baru",
        as: "surat_id_new",
      });
    }
  }
  REVISI.init(
    {
      surat_id_lama: {
        type: DataTypes.INTEGER,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      surat_id_baru: {
        type: DataTypes.INTEGER,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "REVISI",
      tableName: "REVISIS",
    }
  );
  return REVISI;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KOMENTAR extends Model {
    static associate(models) {
      KOMENTAR.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_id_ke",
        as: "jabatan_ke",
      });
      KOMENTAR.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_id_dari",
        as: "jabatan_dari",
      });
      KOMENTAR.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
    }
  }
  KOMENTAR.init(
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
      jabatan_id_ke: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "JABATAN",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      jabatan_id_dari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "JABATAN",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      komentar: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "KOMENTAR",
      tableName: "KOMENTARS",
    }
  );
  return KOMENTAR;
};

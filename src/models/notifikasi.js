"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NOTIFIKASI extends Model {
    static associate(models) {
      NOTIFIKASI.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "surat",
      });
      NOTIFIKASI.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_id_dari",
        as: "pengirim",
      });
      NOTIFIKASI.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_id_ke",
      });
    }
  }
  NOTIFIKASI.init(
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
      pesan: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "NOTIFIKASI",
      tableName: "NOTIFIKASIS",
    }
  );
  return NOTIFIKASI;
};

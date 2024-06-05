"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JABATAN extends Model {
    static associate(models) {
      JABATAN.hasMany(models.NOTIFIKASI, { foreignKey: "jabatan_id_dari" });
      JABATAN.hasMany(models.NOTIFIKASI, { foreignKey: "jabatan_id_ke" });
      JABATAN.hasOne(models.USERS, { foreignKey: "jabatan_id" });
      JABATAN.hasOne(models.KOMENTAR, {
        foreignKey: "jabatan_id_ke",
        as: "komentar1",
      });
      JABATAN.hasOne(models.KOMENTAR, {
        foreignKey: "jabatan_id_dari",
        as: "komentar2",
      });
      JABATAN.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_atas_id",
        as: "jabatan_atas",
      });
      JABATAN.hasOne(models.PERMISION, {
        foreignKey: "jabatan_id",
        as: "permision",
      });
    }
  }
  JABATAN.init(
    {
      name: DataTypes.STRING,
      jabatan_atas_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "JABATAN",
      tableName: "JABATANS",
    }
  );
  return JABATAN;
};

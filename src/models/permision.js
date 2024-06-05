"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PERMISION extends Model {
    static associate(models) {
      PERMISION.belongsTo(models.JABATAN, {
        as: "jabatan",
        foreignKey: "jabatan_id",
      });
      PERMISION.hasOne(models.AKSES_MASTER, {
        foreignKey: "permision_id",
        as: "akses_master",
      });
    }
  }
  PERMISION.init(
    {
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
      buat_surat: DataTypes.BOOLEAN,
      download_surat: DataTypes.BOOLEAN,
      generate_nomor_surat: DataTypes.BOOLEAN,
      upload_tandatangan: DataTypes.BOOLEAN,
      persetujuan: DataTypes.BOOLEAN,
      tagging: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PERMISION",
      tableName: "PERMISIONS",
    }
  );
  return PERMISION;
};

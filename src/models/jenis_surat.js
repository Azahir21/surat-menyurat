"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JENIS_SURAT extends Model {
    static associate(models) {
      JENIS_SURAT.hasMany(models.DAFTAR_SURAT, { foreignKey: "jenis_id" });
      JENIS_SURAT.hasMany(models.TEMPLATE_SURAT, { foreignKey: "jenis_id" });
    }
  }
  JENIS_SURAT.init(
    {
      jenis: DataTypes.STRING,
      kode_jenis: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "JENIS_SURAT",
      tableName: "JENIS_SURATS",
    }
  );
  return JENIS_SURAT;
};

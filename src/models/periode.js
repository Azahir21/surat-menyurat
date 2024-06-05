"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PERIODE extends Model {
    static associate(models) {
      PERIODE.hasMany(models.NOMOR_SURAT, { foreignKey: "periode_id" });
    }
  }
  PERIODE.init(
    {
      tahun: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PERIODE",
      tableName: "PERIODES",
    }
  );
  return PERIODE;
};

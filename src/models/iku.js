"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IKU extends Model {
    static associate(models) {
      IKU.hasMany(models.INDIKATOR, {
        foreignKey: "iku_id",
        as: "indikator",
      });
    }
  }
  IKU.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "IKU",
      tableName: "IKUS",
    }
  );
  return IKU;
};

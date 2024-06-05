"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class STRATEGI extends Model {
    static associate(models) {
      STRATEGI.hasMany(models.INDIKATOR, {
        foreignKey: "strategi_id",
        as: "indikator",
      });
    }
  }
  STRATEGI.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "STRATEGI",
      tableName: "STRATEGIS",
    }
  );
  return STRATEGI;
};

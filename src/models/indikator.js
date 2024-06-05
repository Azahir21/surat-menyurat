"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class INDIKATOR extends Model {
    static associate(models) {
      INDIKATOR.hasMany(models.REPO, {
        foreignKey: "indikator_id",
        as: "indikator",
      });
      INDIKATOR.belongsTo(models.STRATEGI, {
        foreignKey: "strategi_id",
        as: "strategi",
      });
      INDIKATOR.belongsTo(models.IKU, {
        foreignKey: "iku_id",
        as: "iku",
      });
    }
  }
  INDIKATOR.init(
    {
      name: DataTypes.STRING,
      strategi_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "STRATEGI",
          key: "id",
        },
      },
      iku_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "IKU",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "INDIKATOR",
      tableName: "INDIKATORS",
    }
  );
  return INDIKATOR;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class REPO extends Model {
    static associate(models) {
      REPO.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "surat",
      });
      REPO.belongsTo(models.INDIKATOR, {
        foreignKey: "indikator_id",
        as: "indikator",
      });
    }
  }
  REPO.init(
    {
      surat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
      },
      unix_code: DataTypes.STRING,
      indikator_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "INDIKATOR",
          key: "id",
        },
      },
      visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "REPO",
      tableName: "REPOS",
    }
  );
  return REPO;
};

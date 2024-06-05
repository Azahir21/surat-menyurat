"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PERBAIKAN extends Model {
    static associate(models) {
      PERBAIKAN.belongsTo(models.DAFTAR_SURAT, {
        foreignKey: "surat_id",
        as: "daftar_surat",
      });
    }
  }
  PERBAIKAN.init(
    {
      surat_id: {
        type: DataTypes.INTEGER,

        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      perbaikan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PERBAIKAN",
      tableName: "PERBAIKANS",
    }
  );
  return PERBAIKAN;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TEMPLATE_SURAT extends Model {
    static associate(models) {
      TEMPLATE_SURAT.belongsTo(models.JENIS_SURAT, {
        foreignKey: "jenis_id",
        as: "jenis",
      });
    }
  }
  TEMPLATE_SURAT.init(
    {
      judul: DataTypes.STRING,
      path: DataTypes.STRING,
      jenis_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "JENIS_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deskripsi: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "TEMPLATE_SURAT",
      tableName: "TEMPLATE_SURATS",
    }
  );
  return TEMPLATE_SURAT;
};

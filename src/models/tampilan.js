"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TAMPILAN extends Model {
    static associate(models) {
      TAMPILAN.belongsTo(models.JABATAN, { foreignKey: "jabatan_id" });
      TAMPILAN.belongsTo(models.DAFTAR_SURAT, { foreignKey: "surat_id" });
    }
  }
  TAMPILAN.init(
    {
      pin: DataTypes.BOOLEAN,
      dibaca: DataTypes.BOOLEAN,
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
      surat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DAFTAR_SURAT",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "TAMPILAN",
      tableName: "TAMPILANS",
    }
  );
  return TAMPILAN;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PRODI extends Model {
    static associate(models) {
      PRODI.hasMany(models.USERS, { foreignKey: "prodi_id" });
      PRODI.belongsTo(models.FAKULTAS, { foreignKey: "fakultas_id" });
    }
  }
  PRODI.init(
    {
      name: DataTypes.STRING,
      kode_prodi: DataTypes.STRING,
      fakultas_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "FAKULTAS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "PRODI",
      tableName: "PRODIS",
    }
  );
  return PRODI;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class USERS extends Model {
    static associate(models) {
      USERS.belongsTo(models.JABATAN, {
        foreignKey: "jabatan_id",
        as: "jabatan",
      });
      USERS.belongsTo(models.PRODI, { foreignKey: "prodi_id", as: "prodi" });
      USERS.belongsTo(models.FAKULTAS, {
        foreignKey: "fakultas_id",
        as: "fakultas",
      });
      USERS.hasMany(models.DAFTAR_SURAT, { foreignKey: "user_id" });
    }
  }
  USERS.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      jabatan_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "JABATAN",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      prodi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PRODI",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fakultas_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FAKULTAS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      aktif: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "USERS",
      tableName: "USERS",
    }
  );
  return USERS;
};

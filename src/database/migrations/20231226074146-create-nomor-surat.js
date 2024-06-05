"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NOMOR_SURATS", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nomor_surat: {
        type: Sequelize.STRING,
      },
      surat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DAFTAR_SURATS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      periode_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "PERIODES",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NOMOR_SURATS");
  },
};

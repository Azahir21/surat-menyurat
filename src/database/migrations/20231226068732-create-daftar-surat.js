"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DAFTAR_SURATS", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judul: {
        type: Sequelize.STRING,
      },
      jenis_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "JENIS_SURATS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "USERS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      deskripsi: {
        type: Sequelize.STRING,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      path: {
        type: Sequelize.STRING,
      },
      progressBar: {
        type: Sequelize.INTEGER,
      },
      visible: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("DAFTAR_SURATS");
  },
};

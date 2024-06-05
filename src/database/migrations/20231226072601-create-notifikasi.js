"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NOTIFIKASIS", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      jabatan_id_dari: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "JABATANS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      jabatan_id_ke: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "JABATANS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      pesan: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("NOTIFIKASIS");
  },
};

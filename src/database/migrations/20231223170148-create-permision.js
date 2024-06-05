"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PERMISIONS", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jabatan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "JABATANS",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      buat_surat: {
        type: Sequelize.BOOLEAN,
      },
      download_surat: {
        type: Sequelize.BOOLEAN,
      },
      generate_nomor_surat: {
        type: Sequelize.BOOLEAN,
      },
      upload_tandatangan: {
        type: Sequelize.BOOLEAN,
      },
      persetujuan: {
        type: Sequelize.BOOLEAN,
      },
      tagging: {
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
    await queryInterface.dropTable("PERMISIONS");
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "googleId", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "photo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "googleId");
    await queryInterface.removeColumn("users", "photo");
  },
};

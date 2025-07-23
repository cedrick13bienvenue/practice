"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("blogs", "content", {
      type: Sequelize.TEXT,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("blogs", "content", {
      type: Sequelize.STRING,
    });
  },
};

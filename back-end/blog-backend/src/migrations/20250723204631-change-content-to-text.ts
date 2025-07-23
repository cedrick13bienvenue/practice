import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('blogs', 'content', {
      type: DataTypes.TEXT,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('blogs', 'content', {
      type: DataTypes.STRING,
    });
  },
}; 
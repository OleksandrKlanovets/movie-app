'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'Movies',
      {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          allowNull: false,
          autoIncrement: false,
        },
        title: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        year: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        format: {
          type: Sequelize.DataTypes.ENUM('VHS', 'DVD', 'Blu-Ray'),
          allowNull: false,
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Movies');
  },
};

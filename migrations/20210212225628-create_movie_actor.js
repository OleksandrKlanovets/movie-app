'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'MoviesActors',
      {
        movieId: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          references: { model: 'Movies', key: 'id' },
          onDelete: 'CASCADE',
        },
        actorId: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          references: { model: 'Actors', key: 'id' },
          onDelete: 'CASCADE',
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('MoviesActors');
  },
};

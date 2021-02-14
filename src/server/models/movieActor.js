'use strict';

const { Sequelize } = require('sequelize');

class MovieActor extends Sequelize.Model {
  static schema = {
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
  };

  static init(sequelize, options = {}) {
    super.init(
      this.schema,
      { ...options, sequelize, timestamps: false, tableName: 'MoviesActors' },
    );
  }

  static async addMultipleMovieActors(moviesActors) {
    return this.bulkCreate(moviesActors);
  }
}

module.exports = MovieActor;

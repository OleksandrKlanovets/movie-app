'use strict';

const { Sequelize } = require('sequelize');
const Base = require('./base');
const { NotFoundError } = require('../errors');

class Movie extends Base {
  static schema = {
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
  };

  static initRelations(models) {
    const { Actor } = models;
    super.belongsToMany(
      Actor,
      {
        through: 'MoviesActors',
        foreignKey: 'movieId',
        timestamps: false,
      },
    );
  }

  static async getSortedList() {
    return this.findAll({ order: [['title', 'ASC']] });
  }

  static async findByTitle(title) {
    const movies = await this.findAll({ where: { title } });

    if (!movies || !movies.length) {
      throw new NotFoundError(
        `There is no movie with title = "${title}"`,
      );
    }

    return movies;
  }

  static async addMultipleMovies(moviesData) {
    return this.bulkCreate(moviesData);
  }

  static async delete(id) {
    const movie = await this.findById(id);
    return movie.destroy();
  }
}

module.exports = Movie;

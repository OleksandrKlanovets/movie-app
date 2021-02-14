'use strict';

const { Sequelize } = require('sequelize');
const Base = require('./base');

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
        timestamps: false
      }
    );
  }

  static async getSortedList() {
    return this.findAll({ order: [['title', 'ASC']] });
  }

  static async findByTitle(title) {
    return this.findAll({ where: { title } });
  }

  static async addMultipleMovies(moviesData) {
    return this.bulkCreate(moviesData);
  }
}

module.exports = Movie;

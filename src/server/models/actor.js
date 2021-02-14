'use strict';

const { Sequelize, Op } = require('sequelize');
const { NotFoundError } = require('../errors');
const Base = require('./base');

class Actor extends Base {
  static schema = {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  };

  static initRelations(models) {
    const { Movie } = models;
    super.belongsToMany(
      Movie,
      {
        through: 'MoviesActors',
        foreignKey: 'actorId',
        timestamps: false,
      },
    );
  }

  static async findByNames(names) {
    return this.findAll({
      where: {
        name: { [Op.in]: names },
      },
    });
  }

  static async getActorMovies(actorName) {
    const actorMovies = await this.findOne({
      where: { name: actorName },
      include: {
        association: 'Movies',
        through: {
          attributes: [],
        },
      },
    });

    if (!actorMovies) {
      throw new NotFoundError(
        `There is no movie with actor = "${actorName}"`,
      );
    }

    return actorMovies.Movies;
  }

  static async addMultipleActors(names) {
    return this.bulkCreate(names, { ignoreDuplicates: true });
  }
}

module.exports = Actor;

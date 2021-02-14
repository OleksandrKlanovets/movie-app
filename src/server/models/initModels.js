'use strict';

const { Sequelize } = require('sequelize');
const Movie = require('./movie');
const Actor = require('./actor');
const MovieActor = require('./movieActor');

const initModels = (dbConfig, logging = console.log) => {
  const {
    database, username, password, dialect, host, port,
  } = dbConfig;

  const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    logging,
  });

  const models = {
    Movie,
    Actor,
    MovieActor,
  };

  Object.values(models).forEach((model) => model.init(sequelize));
  Object.values(models).forEach((model) => {
    if (model.initRelations) model.initRelations(models);
  });

  return {
    ...models,
    sequelize,
  };
};

module.exports = initModels;

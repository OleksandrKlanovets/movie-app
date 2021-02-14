'use strict';

const Joi = require('joi');
const { movieValidationSchema } = require('../schemas/movieValidationSchema');

const KEYS = ['title', 'year', 'format', 'actors'];

const parseItem = (item) => item
  .split('\n')
  .filter((property) => property.length > 1)
  .reduce((movie, property, i) => {
    const value = property.split(/:\s*(.+)/)[1];
    /* eslint-disable-next-line */
    movie[KEYS[i]] = KEYS[i] === 'actors' ? value.split(/,\s*/) : value;
    return movie;
  }, {});

const parseList = (buffer) => buffer
  .toString()
  .split('\n\n')
  .filter((item) => item.length > 1)
  .map((item) => Joi.attempt(parseItem(item), movieValidationSchema));

const getAllActors = (parsedList) => {
  const actorsSet = parsedList.reduce(
    (actors, item) => {
      /* eslint-disable-next-line */
      for (const actor of item.actors) actors.add(actor);
      return actors;
    },
    new Set(),
  );

  return Array.from(actorsSet);
};

module.exports = {
  parseList,
  getAllActors,
};

'use strict';

const { ValidationError } = require('joi');
const Joi = require('joi');
const {
  WrongParameterValueError, InvalidFileFormatError,
} = require('../errors');
const { movieValidationSchema } = require('../schemas/movieValidationSchema');

const KEYS = {
  Title: 'title',
  'Release Year': 'year',
  Format: 'format',
  Stars: 'actors',
};

const parseActors = (actorsString) => actorsString
  .split(/,\s*/)
  .map((name) => name.trim());

const parseItem = (item) => item
  .split('\n')
  .filter((property) => property.length > 1)
  .reduce((movie, property) => {
    const [key, value] = property.split(/:\s*(.+)/);
    /* eslint-disable-next-line */
    movie[KEYS[key]] = KEYS[key] === 'actors' ? parseActors(value) : value;
    return movie;
  }, {});

const parser = (buffer) => buffer
  .toString()
  .split('\n\n')
  .filter((item) => item.length > 1)
  .map((item) => Joi.attempt(parseItem(item), movieValidationSchema));

const parseList = (buffer) => {
  if (!buffer || !buffer.length) {
    throw new InvalidFileFormatError('Invalid file format: empty or missing file.');
  }

  try {
    return parser(buffer);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new WrongParameterValueError(
        `Error parsing the file: ${error.details[0].message}`,
      );
    }
    throw new InvalidFileFormatError(`Invalid file format: ${error.message}`);
  }
};

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

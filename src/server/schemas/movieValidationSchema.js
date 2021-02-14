'use strict';

const Joi = require('joi');

const FIRST_MOVIE_RELEASE_YEAR = 1888;

const movieValidationSchema = Joi.object({
  title: Joi.string().max(255).required(),
  year: Joi.number().integer().min(FIRST_MOVIE_RELEASE_YEAR).required(),
  format: Joi.string().valid('VHS', 'DVD', 'Blu-Ray').required(),
  actors: Joi.array().items(Joi.string().max(255).required()).required(),
});

const movieListValidationSchema = Joi.array().items(
  movieValidationSchema,
);

module.exports = { 
  movieValidationSchema,
  movieListValidationSchema,
};

'use strict';

const Joi = require('joi');

const FIRST_MOVIE_RELEASE_YEAR = 1888;
const FUTURE_YEARS = 30;

const movieValidationSchema = Joi.object({
  title: Joi.string().min(1).max(255).pattern(/^(?!\s*$).+/).required(),
  year: Joi.number().integer()
    .min(FIRST_MOVIE_RELEASE_YEAR)
    .max(new Date().getFullYear() + FUTURE_YEARS)
    .required(),
  format: Joi.string().valid('VHS', 'DVD', 'Blu-Ray').required(),
  actors: Joi.array().items(
    Joi.string().min(1).max(255).pattern(/^[A-za-z]+( +[A-za-z]+)*$/)
  ).required(),
});

const movieListValidationSchema = Joi.array().items(
  movieValidationSchema,
);

module.exports = {
  movieValidationSchema,
  movieListValidationSchema,
};

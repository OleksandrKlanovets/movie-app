'use strict';

const Joi = require('joi');

const movieValidationSchema = Joi.object({
  title: Joi.string().max(255).required(),
  year: Joi.number().integer().min(1888).required(),
  format: Joi.string().valid('VHS', 'DVD', 'Blu-Ray').required(),
  actors: Joi.array().items(Joi.string().max(255).required()),
});

const movieListValidationSchema = Joi.array().items(
  movieValidationSchema,
);

module.exports = { 
  movieValidationSchema,
  movieListValidationSchema,
};

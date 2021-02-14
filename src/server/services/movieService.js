'use strict';

const Joi = require('joi');
const { ValidationError } = require('joi');
const { WrongParameterValueError, InvalidFileFormatError } = require('../errors');
const { movieValidationSchema } = require('../schemas/movieValidationSchema');
const { parseList, getAllActors } = require('../utils/listParser');

class MovieService {
  constructor(movieModel, actorModel, movieActorModel) {
    this.movieModel = movieModel;
    this.actorModel = actorModel;
    this.movieActorModel = movieActorModel;
  }

  async findMovieById(id) {
    let validId;

    try {
      validId = Joi.attempt(id, Joi.string().uuid().required());
    } catch (error) {
      throw new WrongParameterValueError(
        `Error finding a movie by id: ${error.details[0].message}`,
      );
    }

    return this.movieModel.findById(validId);
  }

  async findMoviesByTitle(title) {
    let validTitle;

    try {
      validTitle = Joi.attempt(title, Joi.string().max(255).required());
    } catch (error) {
      throw new WrongParameterValueError(
        `Error finding movies by title: ${error.details[0].message}`,
      );
    }

    return this.movieModel.findByTitle(validTitle);
  }

  async findMoviesByActor(actorName) {
    let validName;

    try {
      validName = Joi.attempt(actorName, Joi.string().max(255).required());
    } catch (error) {
      throw new WrongParameterValueError(
        `Error finding movies by actor: ${error.details[0].message}`,
      );
    }

    return this.actorModel.getActorMovies(validName);
  }

  async getSortedMovieList() {
    return this.movieModel.getSortedList();
  }

  async addMovie(movieData) {
    try {
      Joi.assert(movieData, movieValidationSchema);
    } catch (error) {
      throw new WrongParameterValueError(
        `Error adding new movie: ${error.details[0].message}`,
      );
    }

    const {
      title, year, format, actors,
    } = movieData;

    const addedMovie = await this.movieModel.create(
      { title, year, format },
    );

    await this.actorModel.addMultipleActors(
      actors.map((actor) => ({ name: actor })),
    );

    const actorsToAdd = await this.actorModel.findByNames(actors);
    await addedMovie.addActors(actorsToAdd);
    return addedMovie;
  }

  async importFromFile(file) {
    let parsedList;

    try {
      parsedList = parseList(file.buffer);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new WrongParameterValueError(
          `Error parsing the file: ${error.details[0].message}`,
        );
      }
      throw new InvalidFileFormatError(`Invalid file format: ${error.message}`);
    }

    const addedMovies = await this.movieModel.addMultipleMovies(
      parsedList.map((item) => ({
        title: item.title, year: item.year, format: item.format,
      })),
    );

    const allActors = getAllActors(parsedList);
    await this.actorModel.addMultipleActors(
      allActors.map((actor) => ({ name: actor })),
    );

    const nameToIdMap = new Map();
    const actorsToAdd = await this.actorModel.findByNames(allActors);
    actorsToAdd.forEach((actor) => nameToIdMap.set(actor.name, actor.id));

    const movieActorIdPairs = [];
    /* eslint-disable-next-line */
    for (let i = 0; i < addedMovies.length; i++) {
      const movieId = addedMovies[i].id;
      parsedList[i].actors.forEach((actor) => {
        movieActorIdPairs.push({ movieId, actorId: nameToIdMap.get(actor) });
      });
    }

    await this.movieActorModel.addMultipleMovieActors(movieActorIdPairs);
  }

  async deleteMovie(id) {
    let validId;

    try {
      validId = Joi.attempt(id, Joi.string().uuid().required());
    } catch (error) {
      throw new WrongParameterValueError(
        `Error deleting a movie by id: ${error.details[0].message}`,
      );
    }

    await this.movieModel.delete(validId);
  }
}

module.exports = MovieService;

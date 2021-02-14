'use strict';

const assert = require('assert');
const sinon = require('sinon');

const {
  WrongParameterValueError, InvalidFileFormatError
} = require('../src/server/errors');

const Movie = require('../src/server/models/movie');
const Actor = require('../src/server/models/actor');
const MovieActor = require('../src/server/models/movieActor');

const MovieService = require('../src/server/services/movieService');

describe('MovieService', () => {
  let movieService;

  before(() => {
    const movieModelStub = sinon.stub(Movie);
    const actorModelStub = sinon.stub(Actor);
    const movieActorModelStub = sinon.stub(MovieActor);

    movieService = new MovieService(
      movieModelStub,
      actorModelStub,
      movieActorModelStub,
    );
  });

  describe('findMovieById', () => {
    it('Invalid id', async () => {
      const invalidId = 'invalid';
      assert.rejects(
        () => movieService.findMovieById(invalidId),
        (err) => {
          assert(err instanceof WrongParameterValueError);
          return true;
        },
      );
    });
  });

  describe('findMoviesByTitle', () => {
    it('Invalid title', async () => {
      const invalidTitle = null;
      assert.rejects(
        () => movieService.findMovieByTitle(invalidTitle),
        (err) => {
          assert(err instanceof WrongParameterValueError);
          return true;
        },
      );
    });
  });

  describe('findMoviesByActor', () => {
    it('Invalid actor name', async () => {
      const invalidName = null;
      assert.rejects(
        () => movieService.findMoviesByActor(invalidName),
        (err) => {
          assert(err instanceof WrongParameterValueError);
          return true;
        },
      );
    });
  });

  describe('addMovie', () => {
    it('Invalid movie data', () => {
      const invalidMovieData = {
        title: 123,
        year: '1923',
        format: 'DVD9',
      };

      assert.rejects(
        () => movieService.addMovie(invalidMovieData),
        (err) => {
          assert(err instanceof WrongParameterValueError);
          return true;
        },
      );
    });
  });

  describe('deleteMovie', () => {
    it('Invalid id', async () => {
      const invalidId = 'invalid';
      assert.rejects(
        () => movieService.deleteMovie(invalidId),
        (err) => {
          assert(err instanceof WrongParameterValueError);
          return true;
        },
      );
    });
  });
});

'use strict';

const assert = require('assert');
const dbConfig = require('../src/server/config/dbConfig');
const initModels = require('../src/server/models/initModels');

const { NotFoundError } = require('../src/server/errors');

const {
  Movie, Actor, MovieActor,
} = initModels(dbConfig.test, false);

describe('MovieModel', () => {
  const movies = [
    {
      id: '405fa745-150f-463d-998b-de73a20c4fe1',
      title: 'Blazing Saddles',
      year: 1974,
      format: 'VHS',
    },
    {
      id: '4c785cd1-6144-4d8f-9a67-c95ccfc23e1d',
      title: 'Casablanca',
      year: 1942,
      format: 'DVD',
    },
  ];

  const actors = [
    {
      id: '79b5041c-d804-4938-9218-5598216050fd',
      name: 'Mel Brooks',
    },
    {
      id: '9b57a10e-bb0d-4bd6-b77e-75d91ee68071',
      name: 'Clevon Little',
    },
    {
      id: '604a42cb-00c9-4a46-80ca-62fa9aba9e79',
      name: 'Harvey Korman',
    },
  ];

  beforeEach(async () => {
    await Actor.sync({ force: true });
    await Movie.sync({ force: true });
    await MovieActor.sync({ force: true });
    const createdActors = await Actor.bulkCreate(actors);
    const createdMovies = await Movie.bulkCreate(movies);
    await createdMovies[0].addActors([createdActors[0], createdActors[1]]);
    await createdMovies[1].addActors([createdActors[1], createdActors[2]]);
  });

  describe('findById', () => {
    const EXISTING_ID = '405fa745-150f-463d-998b-de73a20c4fe1';
    it('Gets an existing movie', async () => {
      const movie = await Movie.findById(EXISTING_ID);
      const {
        id, title, year, format,
      } = movie;
      assert.deepStrictEqual(
        {
          id, title, year, format,
        },
        {
          id: '405fa745-150f-463d-998b-de73a20c4fe1',
          title: 'Blazing Saddles',
          year: 1974,
          format: 'VHS',
        },
      );
    });

    it('Movie not found', async () => {
      const NON_EXISTING_ID = '79b5041c-d804-4938-9218-5598216050f0';
      assert.rejects(
        () => Movie.findById(NON_EXISTING_ID),
        (err) => {
          assert(err instanceof NotFoundError);
          assert.strictEqual(err.message, `There is no Movie with id = "${NON_EXISTING_ID}"`);
          return true;
        },
      );
    });
  });

  describe('getSortedList', () => {
    it('Gets list', async () => {
      const moviesList = await Movie.getSortedList();
      assert.strictEqual(moviesList.length, 2);
      assert.strictEqual(moviesList[0].title, 'Blazing Saddles');
      assert.strictEqual(moviesList[1].title, 'Casablanca');
    });
  });

  describe('findByTitle', () => {
    it('Get an existing movie by title', async () => {
      const EXISTING_TITLE = 'Blazing Saddles';
      const matchingMovies = await Movie.findByTitle(EXISTING_TITLE);
      assert.strictEqual(matchingMovies.length, 1);
      const {
        id, title, year, format,
      } = matchingMovies[0];
      assert.deepStrictEqual(
        {
          id, title, year, format,
        },
        {
          id: '405fa745-150f-463d-998b-de73a20c4fe1',
          title: 'Blazing Saddles',
          year: 1974,
          format: 'VHS',
        },
      );
    });

    it('Movie not found', async () => {
      const NON_EXISTING_TITLE = '79b5041c-d804-4938-9218-5598216050f0';
      assert.rejects(
        () => Movie.findByTitle(NON_EXISTING_TITLE),
        (err) => {
          assert(err instanceof NotFoundError);
          assert.strictEqual(err.message, `There is no movie with title = "${NON_EXISTING_TITLE}"`);
          return true;
        },
      );
    });
  });

  describe('addMultipleMovies', () => {
    it('Adds all movies', async () => {
      const newMovies = [
        {
          title: 'New movie #1',
          year: 1974,
          format: 'VHS',
        },
        {
          title: 'New movie #2',
          year: 1974,
          format: 'VHS',
        },
      ];
      await Movie.addMultipleMovies(newMovies);
      const allMovies = await Movie.findAll();
      assert.strictEqual(allMovies.length, 4);
    });
  });

  describe('delete', () => {
    it('Deletes existing movie', async () => {
      const EXISTING_ID = '405fa745-150f-463d-998b-de73a20c4fe1';
      await Movie.delete(EXISTING_ID);
      const allMovies = await Movie.findAll();
      assert.strictEqual(allMovies.length, 1);
      assert.strictEqual(allMovies[0].id, '4c785cd1-6144-4d8f-9a67-c95ccfc23e1d');
    });

    it('Deletes non-existing movie', async () => {
      const NON_EXISTING_ID = '79b5041c-d804-4938-9218-5598216050f0';
      assert.rejects(
        () => Movie.findById(NON_EXISTING_ID),
        (err) => {
          assert(err instanceof NotFoundError);
          assert.strictEqual(err.message, `There is no Movie with id = "${NON_EXISTING_ID}"`);
          return true;
        },
      );
    });
  });
});

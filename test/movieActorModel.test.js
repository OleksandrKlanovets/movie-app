'use strict';

const assert = require('assert');
const dbConfig = require('../src/server/config/dbConfig');
const initModels = require('../src/server/models/initModels');

const {
  Movie, Actor, MovieActor,
} = initModels(dbConfig.test, false);

describe('MovieActorModel', () => {
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
    await createdMovies[1].addActors([createdActors[1]]);
  });

  describe('addMultipleMovieActors', () => {
    it('Adds all', async () => {
      const newMovieActors = [
        {
          movieId: '4c785cd1-6144-4d8f-9a67-c95ccfc23e1d',
          actorId: '79b5041c-d804-4938-9218-5598216050fd',
        },
        {
          movieId: '4c785cd1-6144-4d8f-9a67-c95ccfc23e1d',
          actorId: '604a42cb-00c9-4a46-80ca-62fa9aba9e79',
        },
      ];
      await MovieActor.addMultipleMovieActors(newMovieActors);
      const allMovieActors = await MovieActor.findAll();
      assert.strictEqual(allMovieActors.length, 5);
    });

    it('Add only non-existent actors', async () => {
      const partiallyNewMovieActors = [
        {
          movieId: '4c785cd1-6144-4d8f-9a67-c95ccfc23e1d',
          // Clevon Little is already in the cast:
          actorId: '9b57a10e-bb0d-4bd6-b77e-75d91ee68071',
        },
        {
          movieId: '4c785cd1-6144-4d8f-9a67-c95ccfc23e1d',
          actorId: '604a42cb-00c9-4a46-80ca-62fa9aba9e79',
        },
      ];
      await MovieActor.addMultipleMovieActors(partiallyNewMovieActors);
      const allMovieActors = await MovieActor.findAll();
      assert.strictEqual(allMovieActors.length, 4);
    });
  });
});

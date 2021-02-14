'use strict';

const assert = require('assert');
const dbConfig = require('../src/server/config/dbConfig');
const initModels = require('../src/server/models/initModels');

const { NotFoundError } = require('../src/server/errors');

const {
  Movie, Actor, MovieActor,
} = initModels(dbConfig.test, false);

describe('ActorModel', () => {
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
    const EXISTING_ID = '79b5041c-d804-4938-9218-5598216050fd';
    it('Gets an existing actor', async () => {
      const actor = await Actor.findById(EXISTING_ID);
      assert.strictEqual(actor.name, 'Mel Brooks');
    });

    it('Actor not found', async () => {
      const NON_EXISTING_ID = '79b5041c-d804-4938-9218-5598216050f0';
      assert.rejects(
        async () => Actor.findById(NON_EXISTING_ID),
        (err) => {
          assert(err instanceof NotFoundError);
          assert.strictEqual(err.message, `There is no Actor with id = "${NON_EXISTING_ID}"`);
          return true;
        },
      );
    });
  });

  describe('findByNames', () => {
    it('Gets matching actor records', async () => {
      const names = ['Mel Brooks', 'Clevon Little'];
      const foundActors = await Actor.findByNames(names);
      assert.strictEqual(foundActors.length, 2);
      assert(names.includes(foundActors[0].name));
      assert(names.includes(foundActors[1].name));
    });
  });

  describe('getActorMovies', () => {
    it('Gets matching movies records', async () => {
      const actorName = 'Clevon Little';
      const trueMovies = new Set(['Blazing Saddles', 'Casablanca']);
      const actorMovies = await Actor.getActorMovies(actorName);
      assert.strictEqual(actorMovies.length, 2);
      assert(trueMovies.has(actorMovies[0].title));
      assert(trueMovies.has(actorMovies[1].title));
    });

    it('Movies not found', async () => {
      const fakeActor = 'fake';
      assert.rejects(
        async () => Actor.getActorMovies(fakeActor),
        (err) => {
          assert(err instanceof NotFoundError);
          assert.strictEqual(err.message, `There is no movie with actor = "${fakeActor}"`);
          return true;
        },
      );
    });
  });

  describe('addMultipleActors', () => {
    it('Adds all actors', async () => {
      const newActors = [
        { name: 'New Actor #1' },
        { name: 'New Actor #2' },
      ];
      await Actor.addMultipleActors(newActors);
      const allActors = await Actor.findAll();
      assert.strictEqual(allActors.length, 5);
    });

    it('Add only non-existent actors', async () => {
      const partiallyNewActors = [
        { name: 'Mel Brooks' },
        { name: 'New actor' },
      ];
      await Actor.addMultipleActors(partiallyNewActors);
      const allActors = await Actor.findAll();
      assert.strictEqual(allActors.length, 4);
    });
  });
});

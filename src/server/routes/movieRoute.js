'use strict';

const express = require('express');

const getMovieRouter = (movieController) => {
  const router = express.Router();

  router.get(
    '/movies',
    (req, res) => movieController.getSortedMovieList(req, res),
  );

  router.get(
    '/movies/:id',
    (req, res) => movieController.findMovieById(req, res),
  );

  router.get(
    '/movies-by-title/:title',
    (req, res) => movieController.findMoviesByTitle(req, res),
  );

  router.get(
    '/movies-by-actor/:name',
    (req, res) => movieController.findMoviesByActor(req, res),
  );

  router.post(
    '/movies',
    (req, res) => movieController.addMovie(req, res),
  );

  router.post(
    '/movies-from-file',
    (req, res) => movieController.importFromFile(req, res),
  );

  router.delete(
    '/movies/:id',
    (req, res) => movieController.deleteMovie(req, res),
  );

  return router;
};

module.exports = getMovieRouter;

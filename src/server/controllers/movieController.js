'use strict';

const path = require('path');
const multer = require('multer');
const {
  NotFoundError, WrongParameterValueError, UnsupportedFileError, InvalidFileFormatError,
} = require('../errors');

const MAX_FILE_SIZE = 1024 * 1024;
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.txt') {
      return cb(new UnsupportedFileError('Only .txt files are allowed.'));
    }
    return cb(null, true);
  },
  limits: {
    files: 1,
    fileSize: MAX_FILE_SIZE,
  },
}).single('movieList');

class MovieController {
  constructor(movieService, logger) {
    this.movieService = movieService;
    this.logger = logger;
  }

  async findMovieById(req, res) {
    try {
      const { id } = req.params;
      const movie = await this.movieService.findMovieById(id);
      res.send(movie);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof WrongParameterValueError) {
        res.status(400).json({ message: error.message });
      } else {
        this.logger.error(error.message);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  }

  async findMoviesByTitle(req, res) {
    try {
      const { title } = req.params;
      const movies = await this.movieService.findMoviesByTitle(title);
      res.send(movies);
    } catch (error) {
      if (error instanceof WrongParameterValueError) {
        res.status(400).json({ message: error.message });
      } else {
        this.logger.error(error.message);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  }

  async findMoviesByActor(req, res) {
    try {
      const { name } = req.params;
      const movies = await this.movieService.findMoviesByActor(name);
      res.send(movies);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof WrongParameterValueError) {
        res.status(400).json({ message: error.message });
      } else {
        this.logger.error(error.message);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  }

  async getSortedMovieList(req, res) {
    try {
      const movies = await this.movieService.getSortedMovieList();
      res.send(movies);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async addMovie(req, res) {
    try {
      const addedMovie = await this.movieService.addMovie(req.body);
      res.send(addedMovie);
    } catch (error) {
      if (error instanceof WrongParameterValueError) {
        res.status(400).json({ message: error.message });
      } else {
        this.logger.error(error.message);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  }

  importFromFile(req, res) {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError
          || err instanceof UnsupportedFileError) {
        res.status(400).json({ message: err.message });
      } else if (err) {
        this.logger.error(JSON.stringify(err));
        res.status(500).json({ message: 'Something went wrong!' });
      } else {
        try {
          await this.movieService.importFromFile(req.file);
          res.json({ message: 'Imported successfully.' });
        } catch (error) {
          console.log(error);
          if (error instanceof WrongParameterValueError
              || error instanceof InvalidFileFormatError) {
            res.status(400).json({ message: error.message });
          } else {
            this.logger.error(error.message);
            res.status(500).json({ message: 'Something went wrong!' });
          }
        }
      }
    });
  }

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      await this.movieService.deleteMovie(id);
      res.json({ message: `Movie with id=${id} has been deleted successfully.` });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof WrongParameterValueError) {
        res.status(400).json({ message: error.message });
      } else {
        this.logger.error(error.message);
        res.status(500).json({ message: 'Something went wrong!' });
      }
    }
  }
}

module.exports = MovieController;

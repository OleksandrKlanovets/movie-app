'use strict';

const express = require('express');
const { json, urlencoded } = require('express');

const appConfig = require('./config');
const dbConfig = require('./config/dbConfig');
const Logger = require('./utils/logger');

const initModels = require('./models/initModels');
const MovieService = require('./services/movieService');
const MovieController = require('./controllers/movieController');
const getMovieRouter = require('./routes/movieRoute');

const { Movie, Actor, MovieActor, sequelize } = initModels(dbConfig[appConfig.NODE_ENV]);
const movieService = new MovieService(Movie, Actor, MovieActor);

const LOGS_PATH = 'logs';
const logger = new Logger(LOGS_PATH);

const movieController = new MovieController(movieService, logger);
const movieRouter = getMovieRouter(movieController);

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use('/api', movieRouter);

const server = app.listen(
  appConfig.PORT,
  () => logger.log(`Started server at port ${appConfig.PORT}...`)
);

const connections = new Map();

server.on('connection', (connection) => {
  connection.on('close', () => {
    connections.delete(connection);
  });
});

const timeout = (msec) => new Promise((resolve) => {
  setTimeout(resolve, msec);
});

const closeConnections = () => {
  logger.log('Closing connections...');

  /* eslint-disable-next-line */
  for (const [connection, res] of connections.entries()) {
    connections.delete(connection);
    res.end('Server stopped.');
    connection.destroy();
  }
};

const freeResources = async () => {
  logger.log('Freeing resourses...');
  await sequelize.close();
};

const gracefulShutdown = async () => {
  server.close((error) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  });
  await timeout(appConfig.SHUTDOWN_TIMEOUT);
  await freeResources();
  closeConnections();
};

process.on('SIGINT', async () => {
  if (appConfig.NODE_ENV === 'production') {
    logger.log('Starting graceful shutdown...');
    await gracefulShutdown();
    logger.log('Server has been stopped successfully.');
    await logger.close();
    process.exit(0);
  } else  {
    process.exit(0);
  }
});

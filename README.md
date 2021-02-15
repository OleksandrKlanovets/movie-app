<h1 align="center">Movie App</h1>
<p align="center">
  An app to browse movies (test assignment solution for WebbyLab)
</p>

## Description

![Main page](/resources/images/mainPage.png)

This app is a test assigment solution for Junior Node.js developer position at WebbyLab. The app implements the following functionality:

- Adding a movie;
- Deleting a movie;
- Getting movie info;
- Getting a sorted list of movies (by title);
- Getting movies either by actor's name or by title;
- Importing a movie list from a file.

## Technological stack and dependencies

- Web-framework: Express.js;
- DBMS: PostgreSQL;
- ORM: Sequelize;
- Validation: Joi;
- dotenv for reading the environment variables from the .env file;
- Mocha and Sinon for tests;
- ESLint as a linter;
- React.js for building the client-side.

## Backend description

### Data model

The data model is not that complicated in this task. However, there're some ambiguous points:

- Can we consider a movie title and the release year to be a composite primary key for a movie relation? There're a lot of examples of movies with the same title (for instance, consider such titles as Employee Of The Month (2005) (2006)). Though I haven't found the movies with the same title and release year, there's a chance such movies exist (especially when talking about indie movies).
- We also cannot consider actors names to be the primary key for an actor relation, but for this task I decided to make a name field unique, so that it is possible to tell when we're reffering to the same actor.

So here is the model I've come up with:

![Data Model](/resources/images/dataModel.jpg)

### Architecture

The server-side implements the layered architecture. The layers include:

- **Domain models.** These are Movie, Actor and MovieActor (as a junction model) models. Implement the domain business logic.
- **Service layer.** Includes MovieService, which contains the application business logic implemented by combining the domain logic into certain use-cases and data validation via validation schemas;
- **Controllers.** Dispatch request handling to services and handle the proper responses.

### Additional features

- Multiple configurations for different purposes via the environment variables;
- Custom logger;
- Graceful shutdown;
- Serving the static with Nginx running inside a Docker container.

## Installation

### Production mode

0. Prerequisites: Node.js, npm, PostgreSQL (with an already created DB), Docker.

1. Clone the repository in the desired folder:

```bash
$ git clone https://github.com/AlexanderKlanovets/movie-app
$ cd movie-app
```

2. Install the dependencies:

```bash
$ npm i
```

3. Run the database migrations:

```bash
$ npx sequelize-cli db:migrate
```

4. Build the client:

```bash
$ cd src/client
$ npm run build
```

5. Run the server. **Warning**: you also need to setup the logger, which initializes inside ```src/server/app.js```. You need to provide a valid log path. Command to run the server (from the root directory):

```bash
$ npm run start
```

6. Build a Docker image with Nginx and run it (from the root directory). At least these commands are valid for the Ubuntu:

```bash
$ docker build -t 1.0.0 .
$ docker run --add-host host.docker.internal:host-gateway  -p 80:80 -p 443:443 -v `pwd`/src/client/build:/www/ --name nginx-movie-app 1.0.0
```

**Warning**: The application port of the server specified in Nginx configs is 3000. If you need to change it, replace the corresponding value in the file ```vhost.conf``` on the 2nd line.

7. Go to 127.0.0.1 in your browser and you're done.

### Development mode

1. Perform the steps 1-3 from Production mode. In development mode you need to specify the development configuration for the server inside ```src/server/config```. To run the server in dev mode execute the following command (it will use nodemon to watch the file system):

```bash
npm run start:dev
```

2. To run the client in dev mode:

```bash
cd src/client
npm start
```

**Warning**: Please make sure that the proxy value inside the client's package.json corresponds to the actual server.

3. Go to 127.0.0.1:3000 in your browser and you're done.
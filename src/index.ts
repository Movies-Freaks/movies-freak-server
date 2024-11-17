import MoviesFreakApp from 'api';
import config from 'config';
import getDatabase from 'database';
import imdbFactory from 'services/imdb/factory';

const database = getDatabase(config.database.driver, config.env);
const imdb = imdbFactory(config.imdb);

const app = new MoviesFreakApp(config.server.host, config.server.port);

app.initialize(database, imdb)
  .start();

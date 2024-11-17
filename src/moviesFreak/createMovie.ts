import { CouldNotCreateMovie } from './errors';
import { Database } from 'database';
import { IMDB, IMDBMovieResult } from 'services/imdb/types';
import { Movie } from './entities';
import { MovieNotFound } from 'database/stores/errors';

export default class CreateMovie {
  private database: Database;
  private imdb: IMDB;
  private imdbId: string;

  constructor(database: Database, imdb: IMDB, imdbId: string) {
    this.database = database;
    this.imdb = imdb;
    this.imdbId = imdbId;
  }

  async execute(): Promise<Movie> {
    try {
      return await this.database.movies.findByIMDBId(this.imdbId);
    } catch (error) {
      if (!(error instanceof MovieNotFound)) throw new CouldNotCreateMovie(error);
    }

    let imdbResult: IMDBMovieResult;

    try {
      imdbResult = await this.imdb.fetchMovieById(this.imdbId);
    } catch (error) {
      throw new CouldNotCreateMovie(error);
    }

    const movie = new Movie({
      name: imdbResult.title,
      plot: imdbResult.plot,
      title: imdbResult.title,
      year: imdbResult.year,
      rated: imdbResult.rated,
      runtime: imdbResult.runtime,
      director: imdbResult.director,
      poster: imdbResult.poster,
      production: imdbResult.production,
      genre: imdbResult.genre,
      writers: imdbResult.writers,
      actors: imdbResult.actors,
      imdbId: imdbResult.imdbId,
      imdbRating: imdbResult.imdbRating
    });

    try {
      return await this.database.movies.create(movie);
    } catch (error) {
      throw new CouldNotCreateMovie(error);
    }
  }
}

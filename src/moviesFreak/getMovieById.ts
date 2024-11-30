import { Database } from 'database';
import { MovieNotFound as MovieDoesNotExist } from 'database/stores/errors';
import { UUID } from 'types';
import { CouldNotGetMovie, MovieNotFound } from './errors';

export default class GetMovieById {
  protected database: Database;
  protected movieId: UUID;

  constructor(database: Database, movieId: UUID) {
    this.database = database;
    this.movieId = movieId;
  }

  async execute() {
    try {
      return await this.database.movies.findById(this.movieId);
    } catch (error) {
      if (error instanceof MovieDoesNotExist) throw new MovieNotFound(error, this.movieId);

      throw new CouldNotGetMovie(error);
    }
  }
}

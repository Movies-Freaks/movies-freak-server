import AbstractMemoryStore from './abstractMemoryStore';
import { IMDBIdAlreadyExists, MovieNotFound, NotFound } from '../errors';
import { Movie } from 'moviesFreak/entities';
import { UUID } from 'types';

export default class MemoryMoviesStore extends AbstractMemoryStore<Movie> {
  async create(movie: Movie) {
    try {
      await this.findByIMDBId(movie.imdbId);

      throw new IMDBIdAlreadyExists(movie.imdbId)
    } catch (error) {
      if (!(error instanceof MovieNotFound)) throw error;
    }

    return super.create(movie);
  }

  async findById(movieId: UUID) {
    try {
      return await super.findById(movieId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new MovieNotFound({ id: movieId });
      }

      throw error;
    }
  }

  async findByIMDBId(imdbId: string) {
    try {
      return await super.findOne({ imdbId });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new MovieNotFound({ imdbId });
      }

      throw error;
    }
  }
}

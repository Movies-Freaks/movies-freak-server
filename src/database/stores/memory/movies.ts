import AbstractMemoryStore from './abstractMemoryStore';
import { Movie } from 'moviesFreak/entities';
import { MovieNotFound, NotFound } from '../errors';
import { UUID } from 'types';

export default class MemoryMoviesStore extends AbstractMemoryStore<Movie> {
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

import AbstractMemoryStore from './abstractMemoryStore';
import { Movie } from 'moviesFreak/entities';
import { MovieNotFound, NotFound } from '../errors';
import { UUID } from 'types';
import { get, isEmpty } from 'lodash';
import { Sort, SortOrder } from '../types';

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

  async findAll(limit: number, skip: number, sort?: Sort) {
    if (isEmpty(sort)) {
      sort = { createdAt: SortOrder.DESC }
    }

    const items = this.all();
    const itemsSorted = this.applySorting(items, sort);

    return {
      totalItems: items.length,
      items: itemsSorted.slice(skip, limit)
    }
  }

  private applySorting(movies: Movie[], sort: Sort) {
    return Object.keys(sort)
      .reduce((prev, field) => {
        const order = sort[field];

        return prev.sort((movieA, movieB) => {
          if (order === SortOrder.DESC) {
            if (get(movieA, field) < get(movieB, field)) return 1;
            if (get(movieA, field) > get(movieB, field)) return -1;
          }
          else {
            if (get(movieA, field) > get(movieB, field)) return 1;
            if (get(movieA, field) < get(movieB, field)) return -1;
          }

          return 0;
        });
      }, movies);
  }
}

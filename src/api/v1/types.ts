import { Json } from 'types';
import { MovieSchema, WatchHubSchema } from 'database/schemas';

export type List<T = Json> = {
  items: T[],
  totalItems: number,
  pagination: {
    page: number,
    perPage: number,
    totalPages: number
  }
};

export type MovieList = List<MovieSchema>;
export type WatchHubList = List<WatchHubSchema>;

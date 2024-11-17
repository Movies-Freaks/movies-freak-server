import { UUID } from 'types';
import { WatchHubPrivacy } from 'moviesFreak/entities/watchHub';

type StoreSchema = {
  id?: UUID,
  createdAt?: Date,
  updatedAt?: Date
}

export type MovieSchema = StoreSchema & {
  name: string,
  plot: string,
  title: string,
  year: string,
  rated: string,
  runtime: string,
  director: string,
  poster: string,
  production: string,
  genre: string[],
  writers: string[],
  actors: string[],
  imdbId: string,
  imdbRating: string,
};

export type WatchHubSchema = StoreSchema & {
  name: string,
  privacy: WatchHubPrivacy,
  description: string,
  totalMovies?: number,
}

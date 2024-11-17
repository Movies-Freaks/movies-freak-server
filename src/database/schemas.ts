import { UUID } from 'types';

export type MovieSchema = {
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
  id?: UUID,
  createdAt?: Date,
  updatedAt?: Date
};

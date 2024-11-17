import Entity from './entity';
import { MovieSchema } from 'database/schemas';

export default class Movie extends Entity {
  name: string;
  plot: string;
  title: string;
  year: string;
  rated: string;
  runtime: string;
  director: string;
  poster: string;
  production: string;
  genre: string[];
  writers: string[];
  actors: string[];
  imdbId: string;
  imdbRating: string;

  constructor(params: MovieSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    Object.assign(this, params);
  }
}

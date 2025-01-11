import { HTTPInternalError, HTTPNotFound, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import GetMovieById from 'moviesFreak/getMovieById';
import { Database } from 'database';
import { Movie } from 'moviesFreak/entities';
import { MovieNotFound } from 'moviesFreak/errors';
import { MovieSchema } from 'database/schemas';
import { UUID } from 'types';

export default class MovieResource extends Monopoly {
  async onGet(request: Request): Promise<Response<MovieSchema>> {
    const database: Database = this.getTitle('database');
    const { movieId }: { movieId?: UUID } = request.params ?? {};

    const getMovieById = new GetMovieById(database, movieId);

    let movie: Movie;

    try {
      movie = await getMovieById.execute();
    } catch (error) {
      if (error instanceof MovieNotFound) throw new HTTPNotFound('MOVIE_NOT_FOUND', error);

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: movie
    };
  }
}

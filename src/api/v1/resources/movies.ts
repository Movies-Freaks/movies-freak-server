import { HTTPBadInput, HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import CreateMovie from 'moviesFreak/createMovie';
import { Database } from 'database';
import { IMDB } from 'services/imdb/types';
import { Movie } from 'moviesFreak/entities';
import { isEmpty } from 'lodash';

export default class MoviesResource extends Monopoly {
  async onPost(request: Request): Promise<Response> {
    const database: Database = this.getTitle('database');
    const imdb: IMDB = this.getTitle('imdb');
    const { imdbId } = request.body ?? {};

    if (isEmpty(imdbId)) throw new HTTPBadInput('MISSING_IMDB_ID')

    const createMovie = new CreateMovie(database, imdb, imdbId);

    let movie: Movie;

    try {
      movie = await createMovie.execute();
    } catch (error) {
      // TODO: Report error
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.CREATED,
      data: movie
    };
  }
}

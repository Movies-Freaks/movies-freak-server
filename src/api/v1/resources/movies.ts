import { HTTPBadInput, HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import CreateMovie from 'moviesFreak/createMovie';
import { Database } from 'database';
import { IMDB } from 'services/imdb/types';
import { Movie } from 'moviesFreak/entities';
import { isEmpty } from 'lodash';
import GetMovies from 'moviesFreak/getMovies';
import Pagination from 'api/pagination';
import { Json } from 'types';

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

  async onGet(request: Request): Promise<Response> {
    const database: Database = this.getTitle('database');
    const { query } = request;

    const page = isEmpty(query.page) ? query.page : Number(query.page);
    const perPage = isEmpty(query.perPage) ? query.perPage : Number(query.perPage);
    const { sort = '' } = query;

    const pagination = new Pagination(page, perPage);
    const getMovies = new GetMovies(
      database,
      pagination.limit,
      pagination.skip,
      sort
    );

    let result: Json;

    try {
      result = await getMovies.execute();
    } catch (error) {
      // TODO: Report error
      throw new HTTPInternalError(error);
    }

    pagination.setTotalItems(result.totalItems);

    return {
      status: HTTPStatusCode.OK,
      data: {
        items: result.items,
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage,
          totalPages: pagination.totalPages
        }
      }
    }
  }
}

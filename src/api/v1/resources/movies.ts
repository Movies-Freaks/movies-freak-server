import { HTTPBadInput, HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';
import { isEmpty } from 'lodash';

import Movies from 'moviesFreak/movies';
import Pagination from 'api/pagination';
import { Database } from 'database';
import { IMDB } from 'services/imdb/types';
import { Json } from 'types';
import { Movie } from 'moviesFreak/entities';
import { MovieList } from '../types';
import { MovieSchema } from 'database/schemas';

export default class MoviesResource extends Monopoly {
  async onPost(request: Request): Promise<Response<MovieSchema>> {
    const database: Database = this.getTitle('database');
    const imdb: IMDB = this.getTitle('imdb');
    const { imdbId } = request.body ?? {};

    if (isEmpty(imdbId)) throw new HTTPBadInput('MISSING_IMDB_ID')

    const createMovie = new Movies.Create(database, imdb, imdbId);

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

  async onGet(request: Request): Promise<Response<MovieList>> {
    const database: Database = this.getTitle('database');
    const { query } = request;

    const page = isEmpty(query.page) ? query.page : Number(query.page);
    const perPage = isEmpty(query.perPage) ? query.perPage : Number(query.perPage);

    const pagination = new Pagination(page, perPage);

    if (pagination.page < 1) throw new HTTPBadInput('INVALID_PAGE');
    if (pagination.perPage < 1) throw new HTTPBadInput('INVALID_PER_PAGE');

    const getMovies = new Movies.GetList(
      database,
      pagination.limit,
      pagination.skip,
      query.sort
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
        totalItems: pagination.totalItems,
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage,
          totalPages: pagination.totalPages
        }
      }
    };
  }
}

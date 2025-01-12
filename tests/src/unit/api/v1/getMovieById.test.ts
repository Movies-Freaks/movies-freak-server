import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import { Resources } from 'tests/src/fixtures/type';

import GetMovieById from 'moviesFreak/movies/getById';
import { MovieSchema } from 'database/schemas';
import { UUID } from 'types';
import { Movie } from 'moviesFreak/entities';

export class GetMovieByIdTest extends APITestCase {
  protected movieId: UUID;

  async setUp() {
    super.setUp();

    const movies = await this.loadFixture<Movie>(Resources.MOVIES);
    this.movieId = movies[2].id;
  }

  async testGetMovieByItsId() {
    const result = await this.simulateGet<MovieSchema>({ path: `/movies/${this.movieId}` });

    this.assertThat(result.id).isEqual(this.movieId);
    this.assertThat(result.imdbId).isEqual('tt1457767');
    this.assertThat(result.name).isEqual('The Conjuring');
  }

  async testReturnErrorWhenMovieIsNotFound() {
    const result = await this.simulateGet<APIError>({
      path: `/movies/${this.generateUUID()}`,
      statusCode: HTTPStatusCode.NOT_FOUND
    });

    this.assertThat(result.code).isEqual('MOVIE_NOT_FOUND');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(GetMovieById, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulateGet<APIError>({
      path: `/movies/${this.movieId}`,
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}

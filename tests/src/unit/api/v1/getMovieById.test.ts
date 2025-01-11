import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import moviesFixture from 'tests/src/fixtures/movies';

import GetMovieById from 'moviesFreak/getMovieById';
import { Database } from 'database';
import { Movie } from 'moviesFreak/entities';
import { MovieSchema } from 'database/schemas';
import { UUID } from 'types';

export class GetMovieByIdTest extends APITestCase {
  database: Database;

  protected movieId: UUID;
  protected movies: Movie[];

  async setUp() {
    super.setUp();

    await this.loadFixtures();
    this.movieId = this.movies[2].id;
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

  private async loadFixtures() {
    const moviesPromises = moviesFixture.map(movieData => {
      const movie = new Movie(movieData);

      return this.database.movies.create(movie);
    });

    this.movies = await Promise.all(moviesPromises);
  }
}

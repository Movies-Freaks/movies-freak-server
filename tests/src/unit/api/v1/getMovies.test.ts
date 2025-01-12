import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import { Resources } from 'tests/src/fixtures/type';

import GetMovies from 'moviesFreak/movies/getList';
import { Movie } from 'moviesFreak/entities';
import { MovieList } from 'api/v1/types';

export class GetMoviesTest extends APITestCase {
  protected movies: Movie[];

  async setUp() {
    super.setUp();

    const fixtures = await this.loadFixtures(this.database, Resources.MOVIES);
    this.movies = fixtures.movies;
  }

  async testGetMoviesWithoutSendingPagination() {
    const result = await this.simulateGet<MovieList>({ path: '/movies' });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(25);
    this.assertThat(result.pagination.totalPages).isEqual(1);
  }

  async testGetMoviesWithoutSendingPage() {
    const result = await this.simulateGet<MovieList>({
      path: '/movies',
      query: { perPage: 2 }
    });

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(2);
    this.assertThat(result.pagination.totalPages).isEqual(3);
  }

  async testGetMoviesWithoutSendingPerPage() {
    const result = await this.simulateGet<MovieList>({
      path: '/movies',
      query: { page: 1 }
    });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(25);
    this.assertThat(result.pagination.totalPages).isEqual(1);
  }

  async testGetMoviesWithSendingPagination() {
    const result = await this.simulateGet<MovieList>({
      path: '/movies',
      query: { page: 3, perPage: 2 }
    });

    this.assertThat(result.items).hasLengthOf(1);
    this.assertThat(result.pagination.page).isEqual(3);
    this.assertThat(result.pagination.perPage).isEqual(2);
    this.assertThat(result.pagination.totalPages).isEqual(3);
  }

  async testGetMoviesWithAscendingSort() {
    const result = await this.simulateGet<MovieList>({
      path: '/movies',
      query: { sort: 'name' }
    });

    this.assertThat(result.items[0].name).isEqual('Annabelle');
    this.assertThat(result.items[1].name).isEqual('It');
    this.assertThat(result.items[2].name).isEqual('It Chapter Two');
    this.assertThat(result.items[3].name).isEqual('Midsommar');
    this.assertThat(result.items[4].name).isEqual('The Conjuring');
  }

  async testGetMoviesWithDescendingSort() {
    const result = await this.simulateGet<MovieList>({
      path: '/movies',
      query: { sort: '-name' }
    });

    this.assertThat(result.items[0].name).isEqual('The Conjuring');
    this.assertThat(result.items[1].name).isEqual('Midsommar');
    this.assertThat(result.items[2].name).isEqual('It Chapter Two');
    this.assertThat(result.items[3].name).isEqual('It');
    this.assertThat(result.items[4].name).isEqual('Annabelle');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(GetMovies, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulateGet<APIError>({
      path: '/movies',
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}

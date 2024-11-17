import moviesFixture from 'tests/src/fixtures/movies';
import APITestCase from '../apiTestCase';
import { Movie } from 'moviesFreak/entities';
import { Json } from 'types';

export class GetMoviesTest extends APITestCase {
  protected movies: Movie[];

  async setUp() {
    super.setUp();

    await this.loadFixtures();
  }

  async testGetMoviesWithoutSendingPagination() {
    const result = await this.simulateGet<Json>({ path: '/movies' });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(25);
    this.assertThat(result.pagination.totalPages).isEqual(1);
  }

  async testGetMoviesWithoutSendingPage() {
    const result = await this.simulateGet<Json>({
      path: '/movies',
      query: { perPage: 2 }
    });

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(2);
    this.assertThat(result.pagination.totalPages).isEqual(3);
  }

  async testGetMoviesWithoutSendingPerPage() {
    const result = await this.simulateGet<Json>({
      path: '/movies',
      query: { page: 1 }
    });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(25);
    this.assertThat(result.pagination.totalPages).isEqual(1);
  }

  async testGetMoviesWithSendingPagination() {
    const result = await this.simulateGet<Json>({
      path: '/movies',
      query: { page: 3, perPage: 2 }
    });

    this.assertThat(result.items).hasLengthOf(1);
    this.assertThat(result.pagination.page).isEqual(3);
    this.assertThat(result.pagination.perPage).isEqual(2);
    this.assertThat(result.pagination.totalPages).isEqual(3);
  }

  async testGetMoviesWithAscendingSort() {
    const result = await this.simulateGet<Json>({
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
    const result = await this.simulateGet<Json>({
      path: '/movies',
      query: { sort: '-name' }
    });

    this.assertThat(result.items[0].name).isEqual('The Conjuring');
    this.assertThat(result.items[1].name).isEqual('Midsommar');
    this.assertThat(result.items[2].name).isEqual('It Chapter Two');
    this.assertThat(result.items[3].name).isEqual('It');
    this.assertThat(result.items[4].name).isEqual('Annabelle');
  }

  private async loadFixtures() {
    const moviesPromises = moviesFixture.map(movieData => {
      const movie = new Movie(movieData);

      return this.database.movies.create(movie);
    });

    this.movies = await Promise.all(moviesPromises);
  }
}

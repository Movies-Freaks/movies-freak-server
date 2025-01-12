import TestCase from 'tests/src/testCase';
import { Resources } from 'tests/src/fixtures/type';

import GetMovies from 'moviesFreak/movies/getList';
import { CouldNotGetMovies } from 'moviesFreak/movies/errors';
import { Database } from 'database';
import { DatabaseError } from 'database/errors';
import { Movie } from 'moviesFreak/entities';
import { SortOrder } from 'database/stores/types';

export class GetMoviesTest extends TestCase {
  protected database: Database;
  protected movies: Movie[];

  async setUp() {
    super.setUp();
    this.database = this.getDatabase();

    const fixtures = await this.loadFixtures(this.database, Resources.MOVIES);
    this.movies = fixtures.movies;
  }

  async testReturnPaginatedMovies() {
    const getMovies = new GetMovies(this.database, 2, 1);

    const result = await getMovies.execute();

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnMoviesSortedAscendentByName() {
    const getMovies = new GetMovies(this.database, 10, 0, { name: SortOrder.ASC });

    const result = await getMovies.execute();

    this.assertThat(result.items[0].name).isEqual('Annabelle');
    this.assertThat(result.items[1].name).isEqual('It');
    this.assertThat(result.items[2].name).isEqual('It Chapter Two');
    this.assertThat(result.items[3].name).isEqual('Midsommar');
    this.assertThat(result.items[4].name).isEqual('The Conjuring');
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnMoviesSortedDescendentByName() {
    const getMovies = new GetMovies(this.database, 10, 0, { name: SortOrder.DESC });

    const result = await getMovies.execute();

    this.assertThat(result.items[0].name).isEqual('The Conjuring');
    this.assertThat(result.items[1].name).isEqual('Midsommar');
    this.assertThat(result.items[2].name).isEqual('It Chapter Two');
    this.assertThat(result.items[3].name).isEqual('It');
    this.assertThat(result.items[4].name).isEqual('Annabelle');
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnEmptyArrayWhenTotalItemsIsLessThanSkip() {
    const getMovies = new GetMovies(this.database, 100, 100);

    const result = await getMovies.execute();

    this.assertThat(result.items).isEmpty();
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testThrowUnexpectedError() {
    this.stubFunction(this.database.movies, 'findAll')
      .rejects(new DatabaseError());

    const getMovies = new GetMovies(this.database, 10, 0);

    await this.assertThat(
      getMovies.execute()
    ).willBeRejectedWith(CouldNotGetMovies);
  }
}

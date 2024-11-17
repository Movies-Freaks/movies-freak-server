import TestCase from 'tests/src/testCase';

import GetMovies from 'moviesFreak/getMovies';
import moviesFixture from 'tests/src/fixtures/movies';
import { CouldNotGetMovies } from 'moviesFreak/errors';
import { Database } from 'database';
import { DatabaseError } from 'database/errors';
import { Movie } from 'moviesFreak/entities';

export class GetMoviesTest extends TestCase {
  protected database: Database;
  protected movies: Movie[];

  async setUp() {
    super.setUp();
    this.database = this.getDatabase();

    this.loadFixtures();
  }

  async testReturnPaginatedMovies() {
    const getMovies = new GetMovies(this.database, 2, 1);

    const result = await getMovies.execute();

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnMoviesSortedAscendentByName() {
    const getMovies = new GetMovies(this.database, 10, 0, 'name');

    const result = await getMovies.execute();

    this.assertThat(result.items[0].name).isEqual('Annabelle');
    this.assertThat(result.items[1].name).isEqual('It');
    this.assertThat(result.items[2].name).isEqual('It Chapter Two');
    this.assertThat(result.items[3].name).isEqual('Midsommar');
    this.assertThat(result.items[4].name).isEqual('The Conjuring');
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnMoviesSortedDescendentByName() {
    const getMovies = new GetMovies(this.database, 10, 0, '-name');

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

  private async loadFixtures() {
    const promises = moviesFixture.map((movieData) => {
      const movie = new Movie(movieData);
      return this.database.movies.create(movie);
    });

    this.movies = await Promise.all(promises);
  }
}

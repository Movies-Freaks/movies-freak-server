import TestCase from 'tests/src/testCase';
import { Resources } from 'tests/src/fixtures/type';

import GetMovieById from 'moviesFreak/movies/getById';
import { CouldNotGetMovie, MovieNotFound } from 'moviesFreak/movies/errors';
import { Database } from 'database';
import { DatabaseError } from 'database/errors';
import { Movie } from 'moviesFreak/entities';
import { UUID } from 'types';

export class GetMovieByIdTest extends TestCase {
  protected database: Database;
  protected movieId: UUID;

  async setUp() {
    super.setUp();
    this.database = this.getDatabase();

    const { movies } = await this.loadFixtures(this.database, Resources.MOVIES);
    this.movieId = movies[1].id;
  }

  async testReturnMovieByItsId() {
    const getMovieById = new GetMovieById(this.database, this.movieId);
    const movie = await getMovieById.execute();

    this.assertThat(movie).isInstanceOf(Movie);
    this.assertThat(movie.id).isEqual(this.movieId);
    this.assertThat(movie.imdbId).isEqual('tt7349950');
    this.assertThat(movie.name).isEqual('It Chapter Two');
  }

  async testThrowErrorWhenMovieIsNotFound() {
    const getMovieById = new GetMovieById(this.database, this.generateUUID());

    this.assertThat(
      getMovieById.execute()
    ).willBeRejectedWith(MovieNotFound);
  }

  async testThrowUnexpectedError() {
    this.stubFunction(this.database.movies, 'findById')
      .rejects(new DatabaseError());

    const getMovieById = new GetMovieById(this.database, this.movieId);

    await this.assertThat(
      getMovieById.execute()
    ).willBeRejectedWith(CouldNotGetMovie);
  }
}

import TestCase from 'tests/src/testCase';

import CreateMovie from 'moviesFreak/createMovie';
import LocalIMDBGateway from 'services/imdb/local';
import { CouldNotCreateMovie } from 'moviesFreak/errors';
import { Database } from 'database';
import { Movie } from 'moviesFreak/entities';
import { IMDBError } from 'services/imdb/errors';
import { DatabaseError } from 'database/errors';

const IMDB_ID = 'tt0111161';

export class CreateMovieTest extends TestCase {
  private useCase: CreateMovie;
  private database: Database;
  private imdb: LocalIMDBGateway;

  setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.imdb = new LocalIMDBGateway();

    this.useCase = new CreateMovie(this.database, this.imdb, IMDB_ID);
  }

  async testCreateMovie() {
    const movie = await this.useCase.execute();

    this.assertThat(movie).isInstanceOf(Movie);
    this.assertThat(movie.id).doesExist();
    this.assertThat(movie.name).isEqual('The Shawshank Redemption');
    this.assertThat(movie.plot).isEqual(
      'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.'
    );
    this.assertThat(movie.title).isEqual('The Shawshank Redemption');
    this.assertThat(movie.year).isEqual('1994');
    this.assertThat(movie.rated).isEqual('R');
    this.assertThat(movie.runtime).isEqual('142 min');
    this.assertThat(movie.director).isEqual('Frank Darabont');
    this.assertThat(movie.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmN'
      + 'lLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
    );
    this.assertThat(movie.production).isEqual('N/A');
    this.assertThat(movie.genre).isEqual(['Drama']);
    this.assertThat(movie.writers).isEqual(['Stephen King', 'Frank Darabont']);
    this.assertThat(movie.actors).isEqual(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
    this.assertThat(movie.imdbId).isEqual('tt0111161');
    this.assertThat(movie.imdbRating).isEqual('9.3/10');
  }

  async testReturnsMovieWhenAlreadyExists() {
    const movie = await this.useCase.execute();
    const secondMovie = await this.useCase.execute();

    this.assertThat(secondMovie.id).isEqual(movie.id)
  }

  async testThrowErrorWhenFindingMovieByIMDBIdFails() {
    this.stubFunction(this.database.movies, 'findByIMDBId')
      .throws(new DatabaseError());

    const error: CouldNotCreateMovie = await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateMovie);

    this.assertThat(error.cause).isInstanceOf(DatabaseError);
  }

  async testThrowErrorWhenIMDBFails() {
    this.stubFunction(this.imdb, 'fetchMovieById')
      .throws(new IMDBError());

    const error: CouldNotCreateMovie = await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateMovie);

    this.assertThat(error.cause).isInstanceOf(IMDBError);
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.database.movies, 'create')
      .throws(new DatabaseError());

    const error: CouldNotCreateMovie =  await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateMovie);

    this.assertThat(error.cause).isInstanceOf(DatabaseError);
  }
}

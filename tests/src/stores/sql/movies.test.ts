import Serializer, { SerializerError } from 'jesusx21/serializer';

import moviesFixture from 'tests/src/fixtures/movies';
import SQLTestCase from '../testCase';

import { IMDBIdAlreadyExists } from 'database/stores/errors';
import { Movie } from 'moviesFreak/entities';
import { MovieNotFound } from 'database/stores/errors';
import { SQLDatabaseException } from 'database/stores/sql/errors';
import { UUID } from 'types';

class MoviesStoreTest extends SQLTestCase {
  protected movies: Movie[];

  async setUp() {
    super.setUp();

    this.movies = await Promise.all(
      moviesFixture.map((movie) => this.database.movies.create(new Movie(movie)))
    );
  }

  protected buildMovie() {
    return new Movie({
      name: 'The Nun',
      plot: 'A priest with a haunted past and a novice on the threshold of her final vows are '
        + 'sent by the Vatican to investigate the death of a young nun in Romania and confront a '
        + 'malevolent force in the form of a demonic nun.',
      title: 'The Nun',
      year: '2018',
      rated: 'R',
      runtime: '96 min',
      director: 'Corin Hardy',
      poster: 'https://m.media-amazon.com/images/M/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NT',
      production: 'N/A',
      genre: ['Horror', 'Mystery', 'Thriller'],
      writers: ['Gary Dauberman', 'James Wan'],
      actors: ['Demián Bichir', 'Taissa Farmiga', 'Jonas Bloquet'],
      imdbId: 'tt5814060',
      imdbRating: '5.3/10'
    });
  }
}

export class CreateMovieTest extends MoviesStoreTest {
  private movieToCreate: Movie;

  async setUp() {
    await super.setUp();

    this.movieToCreate = this.buildMovie();
  }

  async testCreateMovie() {
    const movieCreated = await this.database
      .movies
      .create(this.movieToCreate);

    this.assertThat(movieCreated).isInstanceOf(Movie);
    this.assertThat(movieCreated.id).doesExist();
    this.assertThat(movieCreated.name).isEqual('The Nun');
    this.assertThat(movieCreated.plot).isEqual(
      'A priest with a haunted past and a novice on the threshold of her final vows are '
      + 'sent by the Vatican to investigate the death of a young nun in Romania and confront a '
      + 'malevolent force in the form of a demonic nun.'
    );
    this.assertThat(movieCreated.title).isEqual('The Nun');
    this.assertThat(movieCreated.year).isEqual('2018');
    this.assertThat(movieCreated.rated).isEqual('R');
    this.assertThat(movieCreated.runtime).isEqual('96 min');
    this.assertThat(movieCreated.director).isEqual('Corin Hardy');
    this.assertThat(movieCreated.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NT'
    );
    this.assertThat(movieCreated.production).isEqual('N/A');
    this.assertThat(movieCreated.genre).isEqual(['Horror', 'Mystery', 'Thriller']);
    this.assertThat(movieCreated.writers).isEqual(['Gary Dauberman', 'James Wan']);
    this.assertThat(movieCreated.actors).isEqual(
      ['Demián Bichir', 'Taissa Farmiga', 'Jonas Bloquet']
    );
    this.assertThat(movieCreated.imdbId).isEqual('tt5814060');
    this.assertThat(movieCreated.imdbRating).isEqual('5.3/10');
  }

  async testThrowErrorWhenUniqueFieldIsRepeated() {
    await this.database
      .movies
      .create(this.movieToCreate);

    await this.assertThat(
      this.database
        .movies
        .create(this.movieToCreate)
    ).willBeRejectedWith(IMDBIdAlreadyExists);
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(Serializer<Movie>)
      .expects('fromJson')
      .throws(new SerializerError());

    await this.assertThat(
      this.database
        .movies
        .create(this.movieToCreate)
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.movies, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.database.movies.create(this.buildMovie())
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends MoviesStoreTest {
  private movieId: UUID;

  async setUp() {
    await super.setUp();

    this.movieId = this.movies[1].id;
  }

  async testFindMovieById() {
    const movieFound = await this.database
      .movies
      .findById(this.movieId);

    this.assertThat(movieFound).isInstanceOf(Movie);
    this.assertThat(movieFound.id).isEqual(this.movieId);
    this.assertThat(movieFound.name).isEqual('It Chapter Two');
    this.assertThat(movieFound.imdbId).isEqual('tt7349950');
  }

  async testThrowsErrorWhenMovieIsNotFound() {
    this.movieId = this.generateUUID();

    await this.assertThat(
      this.database
        .movies
        .findById(this.movieId)
    ).willBeRejectedWith(MovieNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.movies, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.database
        .movies
        .findById(this.movieId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindAllTest extends MoviesStoreTest {
  async testFindAllMovies() {
    const { totalItems, items: movies } = await this.database
      .movies
      .findAll(100, 0);

    this.assertThat(movies).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);

    movies.forEach((movie) => this.assertThat(movie).isInstanceOf(Movie));
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: movies } = await this.database
      .movies
      .findAll(2, 1);

    this.assertThat(movies).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(movies[0].name).isEqual('Annabelle');
    this.assertThat(movies[1].name).isEqual('The Conjuring');
  }

  async testReturnEmptyListWhenThereIsNotMovies() {
    await this.cleanDatabase();
    this.buildDatabase();

    const { totalItems, items: movies } = await this.getDatabase()
      .movies
      .findAll(100, 0);

    this.assertThat(movies).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this.database.movies, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
        .movies
        .findAll(100, 0)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

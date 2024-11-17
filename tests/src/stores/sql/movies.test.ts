import Serializer, { SerializerError } from 'jesusx21/serializer';

import moviesFixture from './fixtures/movies';
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
      name: 'It Chapter: Origins',
      plot: 'Is about how the serial clown killer was origined',
      title: 'It',
      year: '2022',
      rated: 'pg-13',
      runtime: '2 horas y media',
      director: 'El Andy Muscchieti',
      poster: 'www.movie.com/poster',
      production: 'Warner Bros',
      genre: ['coming out of age', 'thriller', 'horror'],
      writers: ['I dunno'],
      actors: ['Billy', 'Tom', 'Mike'],
      imdbId: '54fg54f56',
      imdbRating: '10 out of 10'
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
    this.assertThat(movieCreated.name).isEqual('It Chapter: Origins');
    this.assertThat(movieCreated.plot).isEqual('Is about how the serial clown killer was origined');
    this.assertThat(movieCreated.title).isEqual('It');
    this.assertThat(movieCreated.year).isEqual('2022');
    this.assertThat(movieCreated.rated).isEqual('pg-13');
    this.assertThat(movieCreated.runtime).isEqual('2 horas y media');
    this.assertThat(movieCreated.director).isEqual('El Andy Muscchieti');
    this.assertThat(movieCreated.poster).isEqual('www.movie.com/poster');
    this.assertThat(movieCreated.production).isEqual('Warner Bros');
    this.assertThat(movieCreated.genre).isEqual(['coming out of age', 'thriller', 'horror']);
    this.assertThat(movieCreated.writers).isEqual(['I dunno']);
    this.assertThat(movieCreated.actors).isEqual(['Billy', 'Tom', 'Mike']);
    this.assertThat(movieCreated.imdbId).isEqual('54fg54f56');
    this.assertThat(movieCreated.imdbRating).isEqual('10 out of 10');
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
    this.assertThat(movieFound.name).isEqual('It Chapter II');
    this.assertThat(movieFound.plot).isEqual('Is about the same serial clown killer');
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

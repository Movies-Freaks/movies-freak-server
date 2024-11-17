import { Movie } from 'moviesFreak/entities';
import CreateMovie from 'moviesFreak/createMovie';
import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';
import APITestCase from '../apiTestCase';

export class CreateMovieTest extends APITestCase {
  async testCreateMovie() {
    const result = await this.simulatePost<Movie>({
      path: '/movies',
      payload: { imdbId: 'fakeIMDBId' }
    });

    this.assertThat(result.id).doesExist();
    this.assertThat(result.name).isEqual('The Shawshank Redemption');
    this.assertThat(result.plot).isEqual(
      'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.'
    );
    this.assertThat(result.title).isEqual('The Shawshank Redemption');
    this.assertThat(result.year).isEqual('1994');
    this.assertThat(result.rated).isEqual('R');
    this.assertThat(result.runtime).isEqual('142 min');
    this.assertThat(result.director).isEqual('Frank Darabont');
    this.assertThat(result.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZ'
      + 'DViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
    );
    this.assertThat(result.production).isEqual('N/A');
    this.assertThat(result.genre).isEqual(['Drama']);
    this.assertThat(result.writers).isEqual(['Stephen King', 'Frank Darabont']);
    this.assertThat(result.actors).isEqual(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
    this.assertThat(result.imdbId).isEqual('tt0111161');
    this.assertThat(result.imdbRating).isEqual('9.3/10');
  }

  async testReturnsErrorWhenIMDBIdIsNotSent() {
    const result = await this.simulatePost<APIError>({
      path: '/movies',
      payload: {},
      statusCode: HTTPStatusCode.BAD_REQUEST
    });

    this.assertThat(result.code).isEqual('MISSING_IMDB_ID');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(CreateMovie, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost<APIError>({
      path: '/movies',
      payload: { imdbId: 'fakeIMDBId' },
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}

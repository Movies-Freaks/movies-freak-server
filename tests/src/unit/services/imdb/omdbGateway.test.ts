import axios from 'axios';

import TestCase from 'tests/src/testCase';
import { movieResponse } from './responses';

import OMDBGateway from 'services/imdb/omdb';
import OMDBMovieResult from 'services/imdb/omdb/movieResult';
import { IMDBType } from 'services/imdb/types';
import { IncorrectIMDBId, InvalidAPIKey, OMDBException } from 'services/imdb/omdb/errors';

class OMDBGatewayTest extends TestCase {
  gateway: OMDBGateway;

  setUp() {
    super.setUp();

    this.gateway = new OMDBGateway({
      host: 'http://fake-image.com',
      apiKey: 'fake-api-key'
    });
  }
}

export class FetchMovieByIdTest extends OMDBGatewayTest {
  async testRequestMovieByIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves(movieResponse);

    const result = await this.gateway.fetchMovieById('tt0111161');
    const { data } = movieResponse;

    this.assertThat(result).isInstanceOf(OMDBMovieResult);
    this.assertThat(result.isRequestSuccessful()).isTrue();
    this.assertThat(result.title).isEqual(data.Title);
    this.assertThat(result.year).isEqual(data.Year);
    this.assertThat(result.rated).isEqual(data.Rated);
    this.assertThat(result.released).isEqual(data.Released);
    this.assertThat(result.runtime).isEqual(data.Runtime);
    this.assertThat(result.genre).isEqual(data.Genre.split(','));
    this.assertThat(result.director).isEqual(data.Director);
    this.assertThat(result.writers).isEqual(['Stephen King', 'Frank Darabont']);
    this.assertThat(result.actors).isEqual(
      ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
    );
    this.assertThat(result.plot).isEqual(data.Plot);
    this.assertThat(result.language).isEqual(data.Language);
    this.assertThat(result.country).isEqual(data.Country);
    this.assertThat(result.awards).isEqual(data.Awards);
    this.assertThat(result.poster).isEqual(data.Poster);
    this.assertThat(result.ratings[0].source).isEqual(data.Ratings[0].Source);
    this.assertThat(result.ratings[0].value).isEqual(data.Ratings[0].Value);
    this.assertThat(result.ratings[1].source).isEqual(data.Ratings[1].Source);
    this.assertThat(result.ratings[1].value).isEqual(data.Ratings[1].Value);
    this.assertThat(result.ratings[2].source).isEqual(data.Ratings[2].Source);
    this.assertThat(result.ratings[2].value).isEqual(data.Ratings[2].Value);
    this.assertThat(result.imdbId).isEqual(data.imdbID);
    this.assertThat(result.type).isEqual(IMDBType.MOVIE);
    this.assertThat(result.production).isEqual(data.Production);
  }

  async testThrowErrorOnIncorrectIMDBId() {
    this.mockClass(axios, 'static')
      .expects('get')
      .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    await this.assertThat(
      this.gateway.fetchMovieById('tt0111161')
    ).willBeRejectedWith(IncorrectIMDBId);
  }

  async testErrorOnInvalidApiKey() {
    const data = { Response: 'False', Error: 'Invalid API key!' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    await this.assertThat(
      this.gateway.fetchMovieById('tt011161')
    ).willBeRejectedWith(InvalidAPIKey);
  }

  async testErrorOnUnknownOMDBError() {
    const data = { Response: 'False', Error: 'This error is unknown' };

    this.mockClass(axios, 'static')
      .expects('get')
      .rejects({ response: { data } });

    await this.assertThat(
      this.gateway.fetchMovieById('tt011161')
    ).willBeRejectedWith(OMDBException);
  }
}

import axios from 'axios';
import { get } from 'lodash';

import OMDBMovieResult from './movieResult';
import OMDBResult from './result';
import { IMDBQuery } from './types';
import { IMDBType } from '../types';
import { IncorrectIMDBId, InvalidAPIKey, OMDBException } from './errors';
import { Json } from 'types';
import { OMDBConfig } from 'config/types';

export default class OMDBGateway {
  private host: string;
  private apiKey: string;

  constructor(config: OMDBConfig) {
    this.host = config.host;
    this.apiKey = config.apiKey;
  }

  fetchMovieById(imdbId: string) {
    const query: IMDBQuery = {
      type: IMDBType.MOVIE,
      i: imdbId
    };

    return this.request<OMDBMovieResult>(query, IMDBType.MOVIE);
  }

  private async request<T>(query: IMDBQuery, type: IMDBType): Promise<T> {
    const params = Object.keys(query)
      .map((key) => `${key}=${get(query, key)}`)
      .join('&');

    let response: Json;

    try {
      response = await axios
        .get(`${this.host}?apikey=${this.apiKey}&${params}`);
    } catch (error: any) {
      response = error.response;
    }

    const omdbResult = type === IMDBType.MOVIE
      ? new OMDBMovieResult(response.data)
      : new OMDBResult(response.data);

    if (omdbResult.isRequestSuccessful()) return omdbResult as any as T;
    if (omdbResult.isIMDBIdError()) throw new IncorrectIMDBId(query.i);
    if (omdbResult.isInvalidAPIKeyError()) throw new InvalidAPIKey();

    throw new OMDBException(omdbResult.error);
  }
}

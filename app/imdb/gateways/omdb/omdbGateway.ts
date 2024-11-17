import axios from 'axios';
import { get as getKey } from 'lodash';

import { IMDBError, IncorrectIMDBId, InvalidAPIKey } from '../../errors';
import { IMDBQueryObject, IMDBResultType, IMDBType } from '../../../../types/app';
import {
  FilmResult,
  Result,
  TVEpisodeResult,
  TVSeasonResult,
  TVSerieResult
} from './result';

class OMDBGateway {
  private host: string;
  private apiKey: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  fetchTVSerieById(imdbId: string) {
    const query: IMDBQueryObject = {
      type: IMDBType.SERIES,
      i: imdbId
    };

    return this.request<TVSerieResult>(query, IMDBResultType.SERIE);
  }

  fetchTVSeasonBySerieId(serieImdbId: string, seasonNumber: number) {
    const query: IMDBQueryObject = {
      i: serieImdbId,
      type: IMDBType.SERIES,
      Season: seasonNumber
    };

    return this.request<TVSeasonResult>(query, IMDBResultType.SEASON);
  }

  fetchTVEpisodeById(imdbId: string) {
    const query: IMDBQueryObject = {
      i: imdbId,
      type: IMDBType.EPISODE
    };

    return this.request<TVEpisodeResult>(query, IMDBResultType.EPISODE);
  }

  async request<T>(query: IMDBQueryObject, type: IMDBResultType): Promise<T> {
    const params = Object.keys(query)
      .map((key) => `${key}=${getKey(query, key)}`)
      .join('&');

    let response: { data: {} };

    try {
      response = await axios
        .get(`${this.host}?apikey=${this.apiKey}&${params}`);
    } catch (error: any) {
      response = error.response;
    }

    let omdbResult: any;

    switch (type) {
      case IMDBResultType.FILM:
        omdbResult = new FilmResult(response.data);
        break;
      case IMDBResultType.SERIE:
        omdbResult = new TVSerieResult(response.data);
        break;
      case IMDBResultType.SEASON:
        omdbResult = new TVSeasonResult(response.data);
        break;
      case IMDBResultType.EPISODE:
        omdbResult = new TVEpisodeResult(response.data);
        break;
      default:
        omdbResult = new Result(response.data);
    }

    if (omdbResult.isRequestSuccesful()) {
      return omdbResult;
    }

    if (this.isIMDBIdError(omdbResult.error)) {
      throw new IncorrectIMDBId();
    }

    if (this.isInvalidAPIKeyError(omdbResult.error)) {
      throw new InvalidAPIKey();
    }

    throw new IMDBError(omdbResult.error);
  }

  private isIMDBIdError(error?: string) {
    return error === 'Incorrect IMDb ID.';
  }

  private isInvalidAPIKeyError(error?: string) {
    return error === 'Invalid API key!';
  }
}

export default OMDBGateway;

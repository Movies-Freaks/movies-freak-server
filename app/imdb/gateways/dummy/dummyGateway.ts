import {
  TVEpisodeResult,
  TVSeasonResult,
  TVSerieResult
} from './result';

class DummyIMDBGateway {

  async fetchTVSerieById(_imdbId: string) {
    return new TVSerieResult();
  }

  async fetchTVSeasonBySerieId(_serieImdbId: string, _seasonNumber: number) {
    return new TVSeasonResult();
  }

  async fetchTVEpisodeById(_imdbId: string) {
    return new TVEpisodeResult();
  }
}

export default DummyIMDBGateway;

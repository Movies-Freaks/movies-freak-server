import Rating from '../rating';
import { IMDBType } from '../types';
import { ResultIsNotACollection } from '../errors';


export default class OMDBResult {
  private index: number;
  private rawResponse: any;
  protected currentResponse: any;

  type: IMDBType;

  constructor(rawResponse: any) {
    this.rawResponse = rawResponse;
    this.index = 0;

    this.currentResponse = this.isCollection() ? rawResponse.Search[this.index] : rawResponse;
  }

  get title() {
    return this.currentResponse.Title;
  }

  get rated() {
    return this.currentResponse.Rated;
  }

  get released() {
    return this.currentResponse.Released;
  }

  get runtime() {
    return this.currentResponse.Runtime;
  }

  get genre() {
    return this.currentResponse
      .Genre
      .split(',')
      .map((genre: string) => genre.trim());
  }

  get director() {
    return this.currentResponse.Director;
  }

  get writers() {
    return this.currentResponse
      .Writer
      .split(',')
      .map((writer: string) => writer.trim());
  }

  get actors() {
    return this.currentResponse
      .Actors
      .split(',')
      .map((actor: string) => actor.trim());
  }

  get plot() {
    return this.currentResponse.Plot;
  }

  get language() {
    return this.currentResponse.Language;
  }

  get country() {
    return this.currentResponse.Country;
  }

  get awards() {
    return this.currentResponse.Awards;
  }

  get poster() {
    return this.currentResponse.Poster;
  }

  get ratings() {
    return this.currentResponse.Ratings.map((item: any) => {
      return new Rating(item.Source, item.Value);
    });
  }

  get imdbId() {
    return this.currentResponse.imdbID;
  }

  get production() {
    return this.currentResponse.Production;
  }

  get error() {
    return this.rawResponse.Error;
  }

  get imdbRating() {
    const ratings = this.ratings.filter((rating: Rating) => rating.type === 'imdbRating');
    const rating = ratings[0];

    return rating.value;
  }

  isMovie() {
    return this.type === IMDBType.MOVIE;
  }

  isSerie() {
    return this.type === IMDBType.MOVIE;
  }

  isEpisode() {
    return this.type === IMDBType.MOVIE;
  }

  isRequestSuccessful() {
    return JSON.parse(this.rawResponse?.Response?.toLowerCase());
  }

  next() {
    if (!this.isCollection()) {
      throw new ResultIsNotACollection();
    }

    this.setNextIndex();
    this.setCursor();
  }

  isIMDBIdError() {
    return this.error === 'Incorrect IMDb ID.';
  }

  isInvalidAPIKeyError() {
    return this.error === 'Invalid API key!';
  }

  private setNextIndex() {
    this.index += 1;
  }

  private setCursor() {
    if (!this.isCollection()) {
      throw new ResultIsNotACollection();
    }

    this.currentResponse = this.rawResponse.Search[this.index];
  }

  private isCollection() {
    return !!this.rawResponse.Search;
  }
}

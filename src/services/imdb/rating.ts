import { IMDBRatingCritic, RatingCritic } from './types';

export default class Rating {
  source: IMDBRatingCritic;
  value: string;

  constructor(source: IMDBRatingCritic, value: string) {
    this.source = source;
    this.value = value;
  }

  get type() {
    if (this.source === IMDBRatingCritic.IMDB) {
      return RatingCritic.IMDB;
    }

    if (this.source === IMDBRatingCritic.ROTTEN_TOMATOES) {
      return RatingCritic.ROTTEN_TOMATOES;
    }

    if (this.source === IMDBRatingCritic.METACRITIC) {
      return RatingCritic.METACRITIC;
    }

    return RatingCritic.UNKNOWN;
  }
}

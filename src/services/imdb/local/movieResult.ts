import LocalResult from './result';
import Rating from '../rating';
import { IMDBRatingCritic, IMDBType } from '../types';

export default class LocalMovieResult extends LocalResult {
  constructor() {
    super(IMDBType.MOVIE);
  }

  get year() {
    return this.currentResponse.year;
  }

  getRawResponse() {
    return {
      title: 'The Shawshank Redemption',
      year: '1994',
      rated: 'R',
      released: '14 Oct 1994',
      runtime: '142 min',
      genre: ['Drama'],
      director: 'Frank Darabont',
      writers: ['Stephen King', 'Frank Darabont'],
      actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
      plot: 'Over the course of several years, two convicts form a friendship, '
        + 'seeking consolation and, eventually, redemption through basic compassion.',
      language: 'English',
      country: 'United States',
      awards: 'Nominated for 7 Oscars. 21 wins & 42 nominations total',
      poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJ'
        + 'iNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
      ratings: [
        new Rating(IMDBRatingCritic.IMDB, '9.3/10'),
        new Rating(IMDBRatingCritic.ROTTEN_TOMATOES, '91%'),
        new Rating(IMDBRatingCritic.METACRITIC, '82/100')
      ],
      imdbId: 'tt0111161',
      production: 'N/A'
    };
  }
}

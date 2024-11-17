import LocalIMDBGateway from './local';
import LocalMovieResult from './local/movieResult';
import OMDBGateway from './omdb';
import OMDBMovieResult from './omdb/movieResult';

export enum IMDBRatingCritic {
  IMDB = 'Internet Movie Database',
  METACRITIC = 'metacritic',
  ROTTEN_TOMATOES = 'Rotten Tomatoes'
};

export enum RatingCritic {
  IMDB = 'imdbRating',
  METACRITIC = 'metacritic',
  ROTTEN_TOMATOES = 'rottenTomatoes',
  UNKNOWN = 'unknown'
};

export enum IMDBType {
  MOVIE = 'movie'
};

export type IMDBMovieResult = OMDBMovieResult | LocalMovieResult;
export type IMDB = OMDBGateway | LocalIMDBGateway;

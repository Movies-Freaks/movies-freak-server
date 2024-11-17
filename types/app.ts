import DummyIMDBGateway from '../app/imdb/gateways/dummy/dummyGateway';
import DummyFilmResult from '../app/imdb/gateways/dummy/result/film';
import OMDBGateway from '../app/imdb/gateways/omdb/omdbGateway';
import OMDBFilmResult from '../app/imdb/gateways/omdb/result/film';
import { Episode as DummyEpisode } from '../app/imdb/gateways/dummy/result/tvSeason';
import { Episode as OMDBEpisode } from '../app/imdb/gateways/omdb/result/tvSeason';

export type IMDBGateway = DummyIMDBGateway | OMDBGateway;
export type FilmResult = OMDBFilmResult | DummyFilmResult;
export type IMDBEpisode = DummyEpisode | OMDBEpisode;

export type SignUpData = {
  name: string;
  username: string;
  lastName: string;
  password: string;
  email: string;
  birthdate: Date;
}

export enum IMDBType {
  MOVIE = 'movie',
  SERIES = 'series',
  EPISODE = 'episode'
};

export enum IMDBResultType {
  EPISODE = 'episode',
  FILM = 'film',
  SEASON = 'season',
  SERIE = 'serie'
};

export type IMDBQueryObject = {
  type: IMDBType;
  i: string;
  Season?: number;
}

export enum IMDBMonth {
  JAN = 'Jan',
  FEB = 'Feb',
  MAR = 'Mar',
  APR = 'Apr',
  MAY = 'May',
  JUN = 'Jun',
  JUL = 'Jul',
  AUG = 'Aug',
  SEP = 'Sep',
  OCT = 'Oct',
  NOV = 'Nov',
  DEC = 'Dec',
};

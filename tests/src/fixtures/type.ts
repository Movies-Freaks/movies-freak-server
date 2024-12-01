import { Movie, WatchHub } from 'moviesFreak/entities'

export enum Resources {
  MOVIES = 'movies',
  WATCH_HUBS = 'watchHubs'
};

export type Fixtures= {
  movies?: Movie[],
  watchHubs?: WatchHub[]
};

import { Movie, User, WatchHub } from 'moviesFreak/entities'

export enum Resources {
  MOVIES = 'movies',
  USERS = 'users',
  WATCH_HUBS = 'watchHubs'
};

export type Fixtures= {
  movies?: Movie[],
  users?: User[],
  watchHubs?: WatchHub[]
};

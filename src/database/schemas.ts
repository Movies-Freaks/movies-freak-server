import { UUID } from 'types';
import { WatchHubPrivacy } from 'moviesFreak/entities/watchHub';

type StoreSchema = {
  id?: UUID,
  createdAt?: Date,
  updatedAt?: Date
}

export type MovieSchema = StoreSchema & {
  actors: string[],
  director: string,
  genre: string[],
  imdbId: string,
  imdbRating: string,
  name: string,
  plot: string,
  poster: string,
  production: string,
  rated: string,
  runtime: string,
  title: string,
  writers: string[],
  year: string
};

export type SessionSchema = StoreSchema & {
  userId: UUID,
  token: string,
  expiresAt: Date,
  isActive: boolean
};

export type UserPasswordSchema = {
  hash: string,
  salt: string
};

export type UserSchema = StoreSchema & {
  email: string,
  username: string,
  birthdate?: Date,
  firstLastName?: string,
  name?: string,
  password?: UserPasswordSchema,
  secondLastName?: string
};

export type WatchHubSchema = StoreSchema & {
  description: string,
  name: string,
  privacy: WatchHubPrivacy,
  totalMovies?: number
}

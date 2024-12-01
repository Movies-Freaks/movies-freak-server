import { isNil } from 'lodash';

import moviesFixture from './movies';
import usersFixture from './users';
import watchHubsFixture from './watchHubs';
import { Fixtures, Resources } from './type';

import { Database } from 'database';
import { Json } from 'types';
import { Movie, User, WatchHub } from 'moviesFreak/entities';

export default async function generateFixtures(database: Database, resource?: Resources) {
  type Store = typeof database.movies
    | typeof database.users
    | typeof database.watchHubs;

  const loadFixtures = <T>(store: Store, fixtures: Json[], Entity: any) => {
    const promises = fixtures.map((data) => {
      const entity = new Entity(data);

      return store.create(entity as any) as T;
    });

    return Promise.all(promises);
  }

  const fixtures: Fixtures = {};

  if (isNil(resource) || resource === Resources.MOVIES) {
    fixtures.movies = await loadFixtures<Movie>(database.movies, moviesFixture, Movie);
  }

  if (isNil(resource) || resource === Resources.USERS) {
    fixtures.users = await loadFixtures<User>(database.users, usersFixture, User);
  }

  if (isNil(resource) || resource === Resources.WATCH_HUBS) {
    fixtures.watchHubs = await loadFixtures<WatchHub>(
      database.watchHubs,
      watchHubsFixture,
      WatchHub
    );
  }

  return fixtures;
}

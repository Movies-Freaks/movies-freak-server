import { isNil } from 'lodash';
import { SpecifedJson } from 'jesusx21/boardGame/types';

import moviesFixture from './movies';
import sessionsFixture from './sessions';
import usersFixture from './users';
import watchHubsFixture from './watchHubs';
import { Resources } from './type';

import { Database } from 'database';
import { Json } from 'types';
import {
  Movie,
  Session,
  User,
  WatchHub
} from 'moviesFreak/entities';

const fixturesEntities = {
  movies: Movie,
  sessions: Session,
  users: User,
  watchHubs: WatchHub
};

export default class Fixtures {
  private database: Database;
  private fixtures: SpecifedJson<Json[]>;

  constructor(database: Database) {
    this.database = database;

    this.fixtures = {
      movies: moviesFixture,
      sessions: sessionsFixture,
      users: usersFixture,
      watchHubs: watchHubsFixture
    };
  }

  async load(resource: Resources) {
    if (isNil(resource)) return [];

    const promises = this.fixtures[resource]
      .map((data) => {
        const Entity = fixturesEntities[resource];
        const entity = new Entity(data as any);

        return this.database[resource].create(entity as any);
      });

    return Promise.all(promises);
  }
}

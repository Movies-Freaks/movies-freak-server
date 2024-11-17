/* eslint-disable no-param-reassign */
import sinon from 'sinon';
import { isEmpty, omit } from 'lodash';

import buildFixtureGenerator from './fixtures';
import {
  TestCase as ClasspuccinoTestCase
} from 'jesusx21/classpuccino';
import FixturesGenerator from './fixtures/generator';
import { Json } from '../types/common';
import {
  Film,
  TVSerie,
  TVSeason,
  TVEpisode,
  Watchlist,
  Session,
  User
} from '../app/moviesFreak/entities';
import {
  FilmEntity,
  TVEpisodeEntity,
  TVSeasonEntity,
  TVSerieEntity,
  WatchlistEntity
} from '../types/entities';
import { Database } from '../types/database';
import {
  FilmFixture,
  TVEpisodeFixture,
  TVSerieFixture,
  UserFixture
} from './fixtures/types';
import { FixtureGeneratorRecipe } from './fixtures/generator/types';


class TestCase extends ClasspuccinoTestCase {
  private fixturesGenerator: FixturesGenerator;

  constructor() {
    super();

    this.fixturesGenerator = buildFixtureGenerator();
  }

  async createUser(database: Database, data: Json = {}) {
    const [userData] = await this.generateFixtures<UserFixture>({
      type: 'user',
      recipe: [data]
    });

    const user = new User(
      this.ensureUserParams(userData)
    );

    const { password = 'password' } = data;
    user.addPassword(password);

    return database.users.create(user);
  }

  async createUsers(database: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = await this.generateFixtures<UserFixture>({
      type: 'user',
      ...options
    });

    const result: User[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const userData of fixtures) {
      const user = new User(
        this.ensureUserParams(userData)
      );

      user.addPassword('password')

      // eslint-disable-next-line no-await-in-loop
      const userSaved = await database.users.create(user);

      result.push(userSaved);
    }

    return result;
  }

  async createFilm(database: Database, data?: FilmFixture) {
    const recipe = data ? [data] : [];
    const [filmData] = await this.generateFixtures<FilmEntity>({
      recipe,
      type: 'film'
    });
    const film = new Film(filmData);

    return database.films.create(film);
  }

  async createFilms(database: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = await this.generateFixtures<FilmEntity>({
      type: 'film',
      ...options
    });

    const result: Film[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const filmData of fixtures) {
      const film = new Film(
        omit(filmData, ['id', 'createdAt', 'updatedAt'])
      );
      const filmSaved = await database.films.create(film);

      // eslint-disable-next-line no-await-in-loop
      result.push(filmSaved);
    }

    return result;
  }

  async createTVSerie(database: Database, data?: TVSerieFixture) {
    const recipe = data ? [data] : [];

    const [tvSerieData] = await this.generateFixtures<TVSerieEntity>({
      recipe,
      type: 'tvSerie'
    });
    const tvSerie = new TVSerie(tvSerieData);

    return database.tvSeries.create(tvSerie);
  }

  async createTVSeries(db: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = await  this.generateFixtures<TVSerieEntity>({
      type: 'tvSerie',
      ...options
    });

    const result: TVSerie[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvSerieData of fixtures) {
      const tvSerie = new TVSerie(
        omit(tvSerieData, ['id', 'createdAt', 'updatedAt'])
      );

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.tvSeries.create(tvSerie));
    }

    return result;
  }

  async createTVSeason(database: Database, ...args: any[]) {
    let tvSerie: TVSerie;
    let data: TVSeasonEntity = args[0];

    if (args[0] instanceof TVSerie) {
      [tvSerie, data ] = args;
    } else {
      tvSerie = await this.createTVSerie(database);
    }

    const [tvSeasonData] = await  this.generateFixtures<TVSeasonEntity>({
      type: 'tvSeason',
      recipe: [{ ...data, tvSerieId: tvSerie.id }]
    });

    const tvSeason = new TVSeason(tvSeasonData);

    return database.tvSeasons.create(tvSeason);
  }

  async createTVSeasons(database: Database, ...args: any[]) {
    let tvSerie: TVSerie;
    let params: any[];

    if (args[0] instanceof TVSerie) {
      [tvSerie, ...params] = args;
    } else {
      params = args;
      tvSerie = await this.createTVSerie(database);
    }

    const options = this.getFixturesGeneratorOptions(...params);
    const fixtures = await this.generateFixtures<TVSeasonEntity>({
      type: 'tvSeason',
      ...options
    });

    const result: TVSeason[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvSeasonData of fixtures) {
      const tvSeason = new TVSeason({ ...tvSeasonData, tvSerieId: tvSerie.id });

      // eslint-disable-next-line no-await-in-loop
      result.push(await database.tvSeasons.create(tvSeason));
    }

    return result;
  }

  async createTVEpisode(database: Database, ...args: any[]) {
    let tvSeason: TVSeason;
    let data: TVEpisodeFixture = args[0];

    if (args[0] instanceof TVSeason) {
      [tvSeason, data] = args;
    } else {
      tvSeason = await this.createTVSeason(database);
    }

    const [tvEpisodeData] = await this.generateFixtures<TVEpisodeEntity>({
      type: 'tvEpisode',
      recipe: [{
        ...data,
        tvSerieId: tvSeason.tvSerieId,
        tvSeasonId: tvSeason.id
      }]
    });

    const tvEpisode = new TVEpisode(tvEpisodeData);

    return database.tvEpisodes.create(tvEpisode);
  }

  async createTVEpisodes(database: Database, ...args: any[]) {
    let tvSeason: TVSeason;
    let params: any[];

    if (args[0] instanceof TVSeason) {
      [tvSeason, ...params] = args;
    } else {
      params = args;
      tvSeason = await this.createTVSeason(database);
    }

    const options = this.getFixturesGeneratorOptions(...params);
    const fixtures = await this.generateFixtures<TVEpisodeEntity>({
      type: 'tvEpisode',
      ...options
    });

    const result: TVEpisode[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvEpisodeData of fixtures) {
      const tvEpisode = new TVEpisode({
        ...tvEpisodeData,
        tvSerieId: tvSeason.tvSerieId,
        tvSeasonId: tvSeason.id
      });

      // eslint-disable-next-line no-await-in-loop
      result.push(await database.tvEpisodes.create(tvEpisode));
    }

    return result;
  }

  async createWatchlist(database: Database, data?: Json) {
    let { user, ...watchlistData } = data ?? {};
    const recipe = isEmpty(watchlistData) ? [watchlistData] : [];
    const [watchlistFixture] = await this.generateFixtures<WatchlistEntity>({
      recipe,
      type: 'watchlist'
    });

    const watchlist = new Watchlist(watchlistFixture);

    if (!!user) {
      user = await this.createUser(database);
    }

    watchlist.setUser(user);

    return database.watchlists.create(watchlist);
  }

  async createWatchlists(database: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = await this.generateFixtures<WatchlistEntity>({
      type: 'watchlist',
      ...options
    });

    const result: Watchlist[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const watchlistData of fixtures) {
      const watchlist = new Watchlist(watchlistData);

      // eslint-disable-next-line no-await-in-loop
      result.push(await database.watchlists.create(watchlist));
    }

    return result;
  }

  async createSession(database: Database, user: User) {
    const session = new Session({ user });

    session.generateToken()
      .activateToken();

    return database.sessions.create(session);
  }

  generateFixtures<T>(options: FixtureGeneratorRecipe){
    const { type } = options;
    let { quantity, recipe = [] } = options;

    if (!quantity) {
      quantity = isEmpty(recipe) ? 1 : recipe.length;
    }

    return this.fixturesGenerator.generate<T>({ type, quantity, recipe });
  }

  private ensureUserParams(userData: UserFixture) {
    return {
      name: 'Jon',
      username: 'jon',
      email: 'jon@gmail.com',
      ...omit(userData, 'password')
    }
  }

  private getFixturesGeneratorOptions(...args: any[]) {
    const options = [...args].reduce((prev, param) => {
      if (typeof param === 'number') {
        Object.assign(prev, { quantity: param });
      }

      if (Array.isArray(param)) {
        Object.assign(prev, { recipe: param });
      }

      return prev;
    }, {});

    return options;
  }
}

export default TestCase;

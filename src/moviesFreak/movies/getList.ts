import { CouldNotGetMovies } from './errors';
import { Database } from 'database';
import { Sort } from 'database/stores/types';

export default class GetMovieList {
  private database: Database;
  private limit: number;
  private skip: number;
  private sort?: Sort;

  constructor(database: Database, limit: number, skip: number, sort?: Sort) {
    this.database = database;
    this.limit = limit;
    this.skip = skip;
    this.sort = sort;
  }

  async execute() {
    try {
      return await this.database
        .movies
        .findAll(this.limit, this.skip, this.sort)
    } catch (error: any) {
      throw new CouldNotGetMovies(error);
    }
  }
}

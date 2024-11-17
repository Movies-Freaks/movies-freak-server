import { isEmpty } from 'lodash';

import { CouldNotGetMovies } from './errors';
import { Database } from 'database';
import { Sort, SortOrder } from 'database/stores/types';

export default class GetMovies {
  private database: Database;
  private limit: number;
  private skip: number;
  private sort?: string;

  constructor(database: Database, limit: number, skip: number, sort?: string) {
    this.database = database;
    this.limit = limit;
    this.skip = skip;
    this.sort = sort;
  }

  async execute() {
    const sort = this.serializeSort();

    try {
      return await this.database
        .movies
        .findAll(this.limit, this.skip, sort)
    } catch (error: any) {
      throw new CouldNotGetMovies(error);
    }
  }

  private serializeSort(): Sort {
    if (isEmpty(this.sort)) return {};

    return this.sort.split(',')
      .reduce((prev, item) => {
        let field = item;
        let order = SortOrder.ASC;

        if (item.startsWith('-')) {
          field = field.slice(1);
          order = SortOrder.DESC;
        }

        return { ...prev, [field]: order };
      }, {});
  }
}

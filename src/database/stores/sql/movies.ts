import { isEmpty } from 'lodash';

import AbstractSQLStore from './abstractSQLStore'
import { Json, UUID } from 'types';
import { Movie } from 'moviesFreak/entities';
import { MovieNotFound, IMDBIdAlreadyExists } from '../errors';
import { MovieSerializer } from './serializers';
import { Sort, SortOrder } from '../types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';

export default class SQLMoviesStore extends AbstractSQLStore<Movie> {
  async create(movie: Movie): Promise<Movie> {
    const dataToInsert = this.serialize(movie);

    let result: Json;

    try {
      [result] = await this.connection(SQLTables.MOVIES)
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      if (error.constraint === 'movies_imdb_id_unique') {
        throw new IMDBIdAlreadyExists(movie.imdbId);
      }

      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(movieId: UUID): Promise<Movie> {
    return this.findOne({ id: movieId })
  }

  findByIMDBId(imdbId: string): Promise<Movie> {
    return this.findOne({ imdb_id: imdbId })
  }

  async findAll(limit: number, skip: number, sort?: Sort) {
    if (isEmpty(sort)) {
      sort = { createdAt: SortOrder.ASC }
    }

    let items: Json[];

    try {
      items = await this.connection(SQLTables.MOVIES)
        .offset(skip)
        .limit(limit)
        .orderBy(this.serializeSort(sort));
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this.deserialize.bind(this)) as Movie[],
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const result = await this.connection(SQLTables.MOVIES)
        .count()
        .first();

      return Number(result.count ?? 0);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  protected async find(query: Json): Promise<Movie[]> {
    let items: Json[];

    try {
      items = await this.connection(SQLTables.MOVIES)
        .where(query)
        .orderBy('created_at');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return items.map(this.deserialize.bind(this));
  }

  protected async findOne(query: Json): Promise<Movie> {
    let result: Json;

    try {
      result = await this.connection(SQLTables.MOVIES)
        .where(query)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) throw new MovieNotFound(query);

    return this.deserialize(result);
  }

  protected deserialize(data: Json): Movie {
    return MovieSerializer.fromJson(data);
  }

  protected serialize(entity: Movie): Json {
    return MovieSerializer.toJson(entity);
  }
}

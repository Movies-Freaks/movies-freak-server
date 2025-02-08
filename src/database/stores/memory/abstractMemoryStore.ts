import { cloneDeep, get, isEmpty, isNil } from 'lodash';
import { v4 as uuid } from 'uuid';

import AbstractStore from '../abstractStore';
import { Json, UUID, UUIDJson } from 'types';
import { NotFound } from '../errors';
import { Query, Sort, SortOrder } from '../types';

export default abstract class AbstractMemoryStore<T> extends AbstractStore<T> {
  protected items: UUIDJson<T>;

  constructor() {
    super();

    this.items = {};
  }

  async create(entity: T): Promise<T> {
    const entityToSave = cloneDeep(entity);
    const entityId = get(entity, 'id', uuid());

    Object.assign(
      entityToSave,
      {
        id: entityId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    this.items[entityId] = entityToSave;

    return cloneDeep(entityToSave);
  }

  async findById(entityId: UUID): Promise<T> {
    const entity = this.items[entityId];

    if (!entity) {
      throw new NotFound({ id: entityId });
    }

    return cloneDeep(entity);
  }

  async findAll(limit: number, skip: number, sort?: Sort) {
    if (isEmpty(sort)) {
      sort = { createdAt: SortOrder.ASC }
    }

    const items = this.all();
    const itemsSorted = this.applySorting(items, sort);

    return {
      totalItems: items.length,
      items: itemsSorted.slice(skip, skip + limit)
    }
  }

  private applySorting(items: T[], sort: Sort) {
    return Object.keys(sort)
      .reduce((prev, field) => {
        const order = sort[field];

        return prev.sort((movieA, movieB) => {
          if (order === SortOrder.DESC) {
            if (get(movieA, field) < get(movieB, field)) return 1;
            if (get(movieA, field) > get(movieB, field)) return -1;
          }
          else {
            if (get(movieA, field) > get(movieB, field)) return 1;
            if (get(movieA, field) < get(movieB, field)) return -1;
          }

          return 0;
        });
      }, items);
  }

  protected async find(query: Query = {}): Promise<T[]> {
    const { filter, sort } = query;

    let result = Object.values(this.items)
      .filter((item) => {
        return Object.keys(filter)
        .reduce(
          (succeed, key) => succeed && get(filter, key) === get(item, key),
          true
        );
      });

    if (!isEmpty(sort)) result = this.applySorting(result, sort);

    return cloneDeep(result);
  }

  protected async findOne(filter: Json, sort?: Sort): Promise<T> {
    const [entity] = await this.find({ filter, sort });

    if (isNil(entity)) throw new NotFound(filter);

    return entity;
  }

  protected all() {
    return Object.values(this.items);
  }
}

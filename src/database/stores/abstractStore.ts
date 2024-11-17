import { Json, UUID } from 'types';

export default abstract class AbstractStore<T> {
  abstract create(entity: T): Promise<T>;
  abstract findById(entityId: UUID): Promise<T>;
  protected abstract findOne(query: Json): Promise<T>;
  protected abstract find(query: Json): Promise<T[]>;
}

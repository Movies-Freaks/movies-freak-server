import { UUID } from 'types';

export default class Entity {
  readonly id: UUID;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(id?: UUID, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

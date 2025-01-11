import MoviesFreakError from 'error';
import { UUID } from 'types';

export class CouldNotCreateEntity extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}

export class CouldNotGetEntities extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}

export class EntityNotFound extends MoviesFreakError {
  constructor(error: Error, id?: UUID) {
    super({ error, info: { id } });
  }
}

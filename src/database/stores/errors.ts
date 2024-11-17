import { isPlainObject } from 'lodash';

import { DatabaseError } from '../errors';
import { Json, UUID } from 'types';


export class InvalidData extends DatabaseError {
  constructor(data: Json, error?: any) {
    super({
      error,
      info: { data },
      message: error?.message ?? 'Invalid Data',
    });
  }
}

export class IMDBIdAlreadyExists extends DatabaseError {
  constructor(imdbId: string) {
    super({
      info: { imdbId }
    });
  }
}

export class NotFound extends DatabaseError {
  constructor(idOrQuery: UUID | Json) {
    super({
      info: isPlainObject(idOrQuery) ? { query: idOrQuery } : { id: idOrQuery },
      message: 'Record not found'
    });
  }
}

export class MovieNotFound extends NotFound {}

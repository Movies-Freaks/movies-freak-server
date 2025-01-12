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

export class EmailAlreadyExists extends InvalidData {
  constructor(username: string) {
    super({ username });
  }
}

export class IMDBIdAlreadyExists extends InvalidData {
  constructor(imdbId: string) {
    super({ imdbId });
  }
}

export class TokenAlreadyUsed extends InvalidData {
  constructor(token: string) {
    super({ token });
  }
}

export class UsernameAlreadyExists extends InvalidData {
  constructor(username: string) {
    super({ username });
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
export class SessionNotFound extends NotFound {}
export class UserNotFound extends NotFound {}
export class WatchHubNotFound extends NotFound {}

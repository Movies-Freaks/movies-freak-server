import { HTTPInternalError, HTTPUnauthorized, Monopoly } from 'jesusx21/boardGame';
import { isNil } from 'lodash';
import { Request } from 'jesusx21/boardGame/types';

import { Database } from 'database';
import { SessionNotFound } from 'database/stores/errors';
import { Session, User } from 'moviesFreak/entities';

type Headers = {
  authorization: string
};

export default async function authenticate(req: Request, resourceInstance: Monopoly) {
  const database: Database = resourceInstance.getTitle('database');
  const { authorization } = (req.headers ?? {}) as Headers;

  if (isNil(authorization)) {
    throw new HTTPUnauthorized();
  }

  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    throw new HTTPUnauthorized('EXPECTED_BEARER_TOKEN');
  }

  let user: User;
  let session: Session;

  try {
    session = await database
      .sessions
      .findActiveSessionByToken(token);

    user = await database
      .users
      .findById(session.userId);
  } catch (error) {
    if (error instanceof SessionNotFound) {
      throw new HTTPUnauthorized();
    }

    throw new HTTPInternalError(error);
  }

  resourceInstance.setTitle('session', session);
  resourceInstance.setTitle('user', user);
}

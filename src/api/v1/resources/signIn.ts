import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types'
import {
  HTTPConflict,
  HTTPInternalError,
  HTTPNotFound,
  Monopoly
} from 'jesusx21/boardGame'

import SignIn from 'moviesFreak/signIn';
import { Database } from 'database'
import { PasswordDoesntMatch, UserNotFound } from 'moviesFreak/errors';
import { Session } from 'moviesFreak/entities';
import { SessionSchema } from 'database/schemas'

export default class SignInResource extends Monopoly {
  async onPost({ body }: Request): Promise<Response<SessionSchema>> {
    const database: Database = this.getTitle('database');
    const signIn = new SignIn(database, body.emailOrUsername, body.password);

    let session: Session;

    try {
      session = await signIn.execute();
    } catch (error) {
      if (error instanceof PasswordDoesntMatch) {
        throw new HTTPConflict('PASSWORD_DOES_NOT_MATCH');
      }
      if (error instanceof UserNotFound) {
        throw new HTTPNotFound('USER_NOT_FOUND');
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.CREATED,
      data: {
        id: session.id,
        expiresAt: session.expiresAt,
        isActive: session.isActive,
        token: session.token,
        userId: session.userId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    };
  }
}

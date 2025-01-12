import { HTTPConflict, HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import SignUp from 'moviesFreak/signUp';
import { Database } from 'database';
import { EmailAlreadyUsed, UsernameAlreadyUsed } from 'moviesFreak/errors';
import { Session } from 'moviesFreak/entities';
import { SessionSchema } from 'database/schemas';

type Body = {
  email: string,
  username: string,
  password: string
}

export default class SignUpResource extends Monopoly {
  async onPost(request: Request): Promise<Response<SessionSchema>> {
    const database: Database = this.getTitle('database');
    const { email, username, password }= (request.body ?? {}) as Body;

    const signUp = new SignUp(
      database,
      email,
      username,
      password
    );

    let session: Session;

    try {
      session = await signUp.execute()
    } catch (error) {
      if (error instanceof UsernameAlreadyUsed) {
        throw new HTTPConflict('USERNAME_ALREADY_USED');
      }
      if (error instanceof EmailAlreadyUsed) {
        throw new HTTPConflict('EMAIL_ALREADY_USED')
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

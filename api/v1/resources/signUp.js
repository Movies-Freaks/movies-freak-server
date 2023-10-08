import { Monopoly } from '../../../boardGame';

import Register from '../../../app/moviesFreak/signUp';
import {
  EmailAlreadyUsed, UsernameAlreadyUsed
} from '../../../app/moviesFreak/errors';
import { CREATED, HTTPConflict, HTTPInternalError } from '../../httpResponses';

export default class SignUp extends Monopoly {
  async onPost({ body }) {
    const database = this.getTitle('database');
    const signUp = new Register(database, body);

    let session;

    try {
      session = await signUp.execute();
    } catch (error) {
      if (error instanceof EmailAlreadyUsed) {
        throw new HTTPConflict('EMAIL_ALREADY_USED');
      }

      if (error instanceof UsernameAlreadyUsed) {
        throw new HTTPConflict('USERNAME_ALREADY_USED');
      }

      throw new HTTPInternalError(error);
    }

    const presenter = this.getTitle('presenters');

    return {
      status: CREATED,
      data: presenter.presentSession(session)
    };
  }
}
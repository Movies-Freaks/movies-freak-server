import { omit } from 'lodash';

import { Session, User } from './entities';
import {
  EmailAlreadyExists,
  UsernameAlreadyExists
} from '../../database/stores/errors';
import {
  CouldNotSignUp,
  EmailAlreadyUsed,
  UsernameAlreadyUsed
} from './errors';

export default class SignUp {
  constructor(database, userData) {
    this._database = database;
    this._userData = userData;
  }

  async execute() {
    let userCreated;

    try {
      const user = new User(omit(this._userData, 'password'));

      user.addPassword(this._userData.password);
      userCreated = await this._database.users.create(user);
    } catch (error) {
      if (error instanceof EmailAlreadyExists) {
        throw new EmailAlreadyUsed();
      }

      if (error instanceof UsernameAlreadyExists) {
        throw new UsernameAlreadyUsed();
      }

      throw new CouldNotSignUp(error);
    }

    const session = new Session({ user: userCreated });

    session.generateToken()
      .activateToken();

    try {
      return await this._database.sessions.create(session);
    } catch (error) {
      throw new CouldNotSignUp(error);
    }
  }
}

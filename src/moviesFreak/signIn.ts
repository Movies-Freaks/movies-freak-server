import { Database } from 'database';
import { Session, User } from './entities';
import { SessionNotFound, UserNotFound } from 'database/stores/errors';
import { CouldNotSignIn, PasswordDoesntMatch, UserNotFound as UserDoesNotExist } from './errors';

export default class SignIn {
  constructor(
    private database: Database,
    private username: string,
    private password: string
  ) {}


  async execute() {
    let user: User;

    try {
      user = await this.getUserByEmail();
    } catch (error) {
      if (error instanceof UserDoesNotExist) user = await this.getUserByUsername();
      else throw error;
    }

    if (!user.doesPasswordMatch(this.password)) throw new PasswordDoesntMatch();

    await this.deactiveLatestSessionActive(user);

    const session = Session
      .createForUser(user)
      .generateToken()
      .activateToken();

    try {
      return await this.database.sessions.create(session);
    } catch (error) {
      throw new CouldNotSignIn(error);
    }
  }

  private async getUserByEmail(): Promise<User> {
    try {
      return await this.database
        .users
        .findByEmail(this.username);
    } catch (error) {
      if (error instanceof UserNotFound) throw new UserDoesNotExist(error);

      throw new CouldNotSignIn(error, { email: this.username });
    }
  }

  private async getUserByUsername(): Promise<User> {
    try {
      return await this.database
        .users
        .findByUsername(this.username);
    } catch (error) {
      if (error instanceof UserNotFound) throw new UserDoesNotExist(error);

      throw new CouldNotSignIn(error, { username: this.username });
    }
  }

  private async deactiveLatestSessionActive(user: User) {
    try {
      const session = await this.database
        .sessions
        .findLatestActiveByUserId(user.id);

      session.deactivateToken();

      await this.database
        .sessions
        .update(session);
    } catch (error) {
      if (error instanceof SessionNotFound) return;

      throw new CouldNotSignIn(error);
    }
  }
}

import { CouldNotSignUp, EmailAlreadyUsed, UsernameAlreadyUsed } from './errors';
import { Database } from 'database';
import { EmailAlreadyExists, UsernameAlreadyExists } from 'database/stores/errors';
import { Session, User } from './entities';

export default class SignUp {
  private database: Database;

  private email: string;
  private username: string;
  private password: string;

  constructor(
    database: Database,
    email: string,
    username: string,
    password: string
  ) {
    this.database = database;

    this.email = email;
    this.username = username;
    this.password = password;
  }

  async execute() {
    let user: User;

    try {
      user = await this.createUser();
    } catch (error) {
      if (error instanceof UsernameAlreadyExists) {
        throw new UsernameAlreadyUsed(this.username, error);
      }
      if (error instanceof EmailAlreadyExists) {
        throw new EmailAlreadyUsed(this.email, error);
      }

      throw new CouldNotSignUp(error);
    }

    let session: Session;

    try {
      session = await this.createSession(user);
    } catch (error) {
      throw new CouldNotSignUp(error);
    }

    return session;
  }

  protected async createUser() {
    const user = new User({
      email: this.email,
      username: this.username,
    });

    user.addPassword(this.password);

    return await this.database.users.create(user);
  }

  protected async createSession(user: User) {
    const sessionToCreate = Session
      .createForUser(user)
      .generateToken()
      .activateToken();

    const session = await this.database.sessions.create(sessionToCreate);

    session.addUser(user);

    return session;
  }
}

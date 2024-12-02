import DateUtils from 'jesusx21/dateUtils';

import TestCase from 'tests/src/testCase';

import SignUp from 'moviesFreak/signUp';
import { CouldNotSignUp, EmailAlreadyUsed, UsernameAlreadyUsed } from 'moviesFreak/errors';
import { DatabaseError } from 'database/errors';
import { Session, User } from 'moviesFreak/entities';

export class SignUpTest extends TestCase {
  private signUp: SignUp;

  async setUp() {
    this.createSandbox();

    this.database = this.getDatabase();
    this.signUp = new SignUp(
      this.database,
      'jewHunter@hotmail.com',
      'jewHunter',
      'ThisIsMyPassword'
    );
  }

  tearDown() {
    this.removeDatabase();
    this.restoreSandbox();
  }

  async testSignUpReturnsASession() {
    const session = await this.signUp.execute();

    this.assertThat(session).isInstanceOf(Session);
    this.assertThat(session.token).doesExist();
    this.assertThat(session.expiresAt).isEqualDate(DateUtils.getDateNYearsFromNow(1));
    this.assertThat(session.isActive).isTrue();
    this.assertThat(session.userId).doesExist();
    this.assertThat(session.user).isInstanceOf(User);
  }

  async testSignUpCreatesUser() {
    const session = await this.signUp.execute();
    const user = await this.database.users.findById(session.userId);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.name).isUndefined();
    this.assertThat(user.firstLastName).isUndefined();
    this.assertThat(user.secondLastName).isUndefined();
    this.assertThat(user.username).isEqual('jewHunter');
    this.assertThat(user.email).isEqual('jewHunter@hotmail.com');
    this.assertThat(user.password.hash).doesExist();
    this.assertThat(user.password.salt).doesExist();
  }

  async testThrowsErrorWhenEmailWasAlreadyUsed() {
    await this.signUp.execute();

    const signUp = new SignUp(
      this.database,
      'jewHunter@hotmail.com',
      'junter',
      'ThisIsMyPassword'
    );

    await this.assertThat(
      signUp.execute()
    ).willBeRejectedWith(EmailAlreadyUsed);
  }

  async testThrowsErrorWhenUsernameWasAlreadyUsed() {
    await this.signUp.execute();

    const signUp = new SignUp(
      this.database,
      'junter@hotmail.com',
      'jewHunter',
      'ThisIsMyPassword'
    );

    await this.assertThat(
      signUp.execute()
    ).willBeRejectedWith(UsernameAlreadyUsed);
  }

  async testThrowsErrorWhenSavingSessionFails() {
    this.stubFunction(this.database.sessions, 'create')
      .throws(new DatabaseError());

    await this.assertThat(
      this.signUp.execute()
    ).willBeRejectedWith(CouldNotSignUp);
  }
}

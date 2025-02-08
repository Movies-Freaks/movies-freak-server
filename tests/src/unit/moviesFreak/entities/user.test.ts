import TestCase from 'tests/src/testCase';

import User, { UserPassword } from 'moviesFreak/entities/user';

export class UserPasswordTest extends TestCase {
  testCreateNewUserPasswordWithoutSendingSalt() {
    const userPassword = UserPassword.encrypt('password');

    this.assertThat(userPassword).isInstanceOf(UserPassword);
    this.assertThat(userPassword.hash).doesExist();
    this.assertThat(userPassword.salt).doesExist();
  }

  testCreateNewUserPasswordSendingSalt() {
    const userPassword = UserPassword.encrypt('password', 'salt');

    this.assertThat(userPassword).isInstanceOf(UserPassword);
    this.assertThat(userPassword.hash).doesExist();
    this.assertThat(userPassword.salt).isEqual('salt');
  }

  testReturnTrueWhenPasswordMatches() {
    const userPassword = UserPassword.encrypt('password');
    const password = UserPassword.encrypt('password', userPassword.salt);

    this.assertThat(
      userPassword.match(password)
    ).isTrue();
  }

  testReturnFalseWhenPasswordDoesNotMatch() {
    const userPassword = UserPassword.encrypt('password');
    const password = UserPassword.encrypt('otherPassword');

    this.assertThat(
      userPassword.match(password)
    ).isFalse();
  }
}

export class UserTest extends TestCase {
  user: User;

  setUp(): void {
    this.user = new User({
      email: 'jon@doe.com',
      username: 'jon.doh'
    });

    this.user.addPassword('password')
  }

  testReturnTrueWhenPasswordMatches() {
    this.assertThat(
      this.user.doesPasswordMatch('password')
    ).isTrue();
  }

  testReturnFalseWhenPasswordDoesNotMatch() {
    this.assertThat(
      this.user.doesPasswordMatch('otherPassword')
    ).isFalse();
  }
}

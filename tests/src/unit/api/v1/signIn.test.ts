import { APIError } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import { Resources } from 'tests/src/fixtures/type';

import SignIn from 'moviesFreak/signIn';
import { Session } from 'moviesFreak/entities';

export class SignInTest extends APITestCase {
  async setUp() {
    super.setUp();

    await this.loadFixture(Resources.USERS, this.database);
  }

  async testSignInWithEmail() {
    const body = await this.simulatePost<Session>({
      path: '/signIn',
      statusCode: 201,
      payload: {
        emailOrUsername: 'diggory@hogwarts.wiz',
        password: 'fakePasswordSalt'
      }
    });

    this.assertThat(body.id).doesExist();
    this.assertThat(body.token).doesExist();
    this.assertThat(new Date(body.expiresAt)).isGreaterThan(new Date());
    this.assertThat(body.isActive).isTrue();
    this.assertThat(body.userId).doesExist;
  }

    async testSignInWithUsername() {
      const body = await this.simulatePost<Session>({
        path: '/signIn',
        statusCode: 201,
        payload: {
          emailOrUsername: 'cedric',
          password: 'fakePasswordSalt'
        }
      });

      this.assertThat(body.id).doesExist();
      this.assertThat(body.token).doesExist();
      this.assertThat(new Date(body.expiresAt)).isGreaterThan(new Date());
      this.assertThat(body.isActive).isTrue();
      this.assertThat(body.userId).doesExist;
    }

    async testReturnErrorWhenUsernameIsNotRegister() {
      const body = await this.simulatePost<APIError>({
        path: '/signIn',
        statusCode: 404,
        payload: {
          emailOrUsername: 'cedrico',
          password: 'fakePasswordSalt'
        }
      });

      this.assertThat(body.code).isEqual('USER_NOT_FOUND');
    }

    async testReturnErrorWhenEmailIsNotRegister() {
      const body = await this.simulatePost<APIError>({
        path: '/signIn',
        statusCode: 404,
        payload: {
          emailOrUsername: 'cedrico@gmail.com',
          password: 'fakePasswordSalt'
        }
      });

      this.assertThat(body.code).isEqual('USER_NOT_FOUND');
    }

    async testReturnErrorOnUnexpectedError() {
      this.mockClass(SignIn, 'instance')
        .expects('execute')
        .throws(new Error());

      const body = await this.simulatePost<APIError>({
        path: '/signIn',
        statusCode: 500,
        payload: {
          emailOrUsername: 'cedrico@gmail.com',
          password: 'fakePasswordSalt'
        },
      });

      this.assertThat(body.code).isEqual('UNEXPECTED_ERROR');
    }
}

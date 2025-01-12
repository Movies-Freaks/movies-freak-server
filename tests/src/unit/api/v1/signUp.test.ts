import { APIError } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';

import { Json } from 'types';
import { SessionSchema } from 'database/schemas';
import SignUp from 'moviesFreak/signUp';

export class SignUpTest extends APITestCase {
  private userData: Json;

  setUp() {
    super.setUp();

    this.createSandbox();
    this.userData = {
      email: 'evan@gmail.com',
      username: 'evan',
      password: 'americanHorrorStory12'
    };
  }

  tearDown(): void {
    this.removeDatabase();
    this.restoreSandbox();
  }

  async testSignUpUser() {
    const result = await this.simulatePost<SessionSchema>({
      path: '/signUp',
      payload: this.userData
    });

    this.assertThat(result.id).doesExist();
    this.assertThat(result.token).doesExist();
    this.assertThat(new Date(result.expiresAt)).isGreaterThan(new Date());
    this.assertThat(result.isActive).isTrue();
    this.assertThat(result.userId).doesExist();
  }

  async testReturnsErrorOnEmailAlreadyUsed() {
    await this.simulatePost<SessionSchema>({
      path: '/signUp',
      payload: this.userData
    });

    const result = await this.simulatePost<APIError>({
      path: '/signUp',
      statusCode: 409,
      payload: {
        ...this.userData,
        username: 'peters'
      }
    });

    this.assertThat(result.code).isEqual('EMAIL_ALREADY_USED');
  }

  async testReturnsErrorOnUsernameAlreadyUsed() {
    await this.simulatePost<SessionSchema>({
      path: '/signUp',
      payload: this.userData
    });

    const result = await this.simulatePost<APIError>({
      path: '/signUp',
      statusCode: 409,
      payload: {
        ...this.userData,
        email: 'peters@gmail.com'
      }
    });

    this.assertThat(result.code).isEqual('USERNAME_ALREADY_USED');
  }

  async testReturnsHandleErrorOnUnexpectedError() {
    this.mockClass(SignUp, 'instance')
      .expects('execute')
      .throws(new Error('Use case fails'));

    const result = await this.simulatePost<APIError>({
      path: '/signUp',
      payload: this.userData,
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}

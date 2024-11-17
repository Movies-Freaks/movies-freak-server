import request from 'supertest';
import { omit } from 'lodash';
import { ClasspuccinoError } from '../../jesusx21/classpuccino/errors';

import MoviesFreakApp from '../../api/index';
import TestCase from '../testHelper';
import { Database } from '../../types/database';
import { HTTPStatusCode } from '../../boardGame/types';
import { SignUpData } from '../../types/app';
import { Session } from '../../types/api';
import { UserEntity } from '../../types/entities';

interface RequestParams {
  path: string;
  authorization?: string;
  statusCode?: HTTPStatusCode;
}

interface PostRequestParams extends RequestParams{
  payload: {}
}

interface GetRequestParams extends RequestParams{
  query: {}
}

export interface UserFixture extends UserEntity {
  password: string;
}

class InvalidSessionData extends ClasspuccinoError {
  constructor(message: string) {
    super({ message });
  }
}

class APITestCase extends TestCase {
  private moviesFreakApp: MoviesFreakApp;

  constructor() {
    super();

    this.moviesFreakApp = this.buildTestApp(this.getDatabase());
  }

  async simulateGet<T>(params: GetRequestParams): Promise<T> {
    const {
      path,
      query = {},
      statusCode = 200
    } = params;

    const { body } = await request(this.moviesFreakApp.getExpressApp())
      .get(`/movies-freak/api/v1${path}`)
      .query(query)
      .expect(statusCode);

    return body;
  }

  async registerUser(data: SignUpData) {
    const [userData] = await this.generateFixtures<UserFixture>({
      type: 'user',
      recipe: [omit(data, 'password')]
    });

    if (!data.username && !data.email) {
      throw new InvalidSessionData('One of username or email is required for register user');
    }

    if (!data.password) {
      throw new InvalidSessionData('Password is required for register user');
    }

    const session = await this.simulatePost<Session>({
      path: '/sign-up',
      payload: { ...omit(userData, ['id', 'createdAt', 'updatedAt']), password: data.password }
    });

    return session
  }
}

export default APITestCase;

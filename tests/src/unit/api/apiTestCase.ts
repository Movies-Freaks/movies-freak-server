import request from 'supertest';
import { HTTPStatusCode } from 'jesusx21/boardGame/types';
import { isNil } from 'lodash';

import TestCase from 'tests/src/testCase';

import config from 'config';
import imdbFactory from 'services/imdb/factory';
import MoviesFreakApp from 'api';
import { Database } from 'database';
import { IMDB } from 'services/imdb/types';
import { Json } from 'types';

class MoviesFreakAppTest extends MoviesFreakApp {
  getApp() {
    return this.app;
  }
}

enum RequestVerb {
  POST = 'post',
  PUT = 'put',
  GET = 'get'
};

type RequestParams = {
  path: string,
  authorization?: string,
  statusCode?: HTTPStatusCode,
  token?: string
};

type PostRequestParams = RequestParams & {
  payload?: Json
}

type PutRequestParams = RequestParams & {
  payload?: Json
}

type GetRequestParams = RequestParams & {
  query?: Json
}

type HTTPRequestParams = RequestParams & {
  query?: Json,
  payload?: Json
}

export default class APITestCase extends TestCase {
  private moviesFreak: MoviesFreakAppTest;

  database: Database;
  imdb: IMDB;

  setUp() {
    super.setUp();

    this.database = this.getDatabase(config.database.driver);
    this.imdb = imdbFactory(config.imdb);

    this.buildTestApp(this.database, this.imdb);
  }

  tearDown() {
    super.tearDown();

    this.removeDatabase();
  }

  async simulatePost<T = Json>(params: PostRequestParams): Promise<T> {
    const { statusCode = 201 } = params;

    return this.simulateRequest(RequestVerb.POST, { ...params, statusCode});
  }

  async simulatePut<T = Json>(params: PutRequestParams): Promise<T> {
    return this.simulateRequest(RequestVerb.PUT, params);
  }

  async simulateGet<T = Json>(params: GetRequestParams): Promise<T> {
    return this.simulateRequest(RequestVerb.GET, params);
  }

  private buildTestApp(database: Database, imdb: IMDB) {
    this.moviesFreak = new MoviesFreakAppTest(config.server.host, config.server.port);

    this.moviesFreak.initialize(database, imdb);
  }

  private initRequest(verb: RequestVerb, params: RequestParams) {
    const { path, authorization } = params;

    const requestBuilder = request(this.moviesFreak.getApp())
      [verb](`/api/v1${path}`)
      .set('Accept', 'application/json');

    if (!!authorization) {
      requestBuilder.set('Authorization', authorization);
    }

    return requestBuilder;
  }

  private async simulateRequest(verb: RequestVerb, params: HTTPRequestParams) {
    const {
      token,
      statusCode = 200,
      ...requestParams
    } = params;

    let request = this.initRequest(verb, requestParams);

    if (verb === RequestVerb.GET) request = request.query(params.query);
    if (verb === RequestVerb.POST) request = request.send(params.payload);
    if (verb === RequestVerb.PUT) request = request.send(params.payload);

    if (!isNil(token)) {
      request = request.set('Authorization', `Bearer ${token}`)
    }

    const { body } = await request.expect(statusCode);

    return body;
  }
}

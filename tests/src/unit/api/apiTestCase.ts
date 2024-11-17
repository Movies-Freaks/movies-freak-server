import MoviesFreakApp from 'api';
import request from 'supertest';
import config from 'config';
import getDatabase from 'database';
import { Database } from 'database';
import { HTTPStatusCode } from 'jesusx21/boardGame/types';
import imdbFactory from 'services/imdb/factory';
import { IMDB } from 'services/imdb/types';
import TestCase from 'tests/src/testCase';
import { Json } from 'types';

class MoviesFreakAppTest extends MoviesFreakApp {
  getApp() {
    return this.app;
  }
}

enum RequestVerb {
  POST = 'post',
  GET = 'get'
};

type RequestParams = {
  path: string;
  authorization?: string;
  statusCode?: HTTPStatusCode;
};

type PostRequestParams = RequestParams & {
  payload?: Json
}

type GetRequestParams = RequestParams & {
  query?: Json
}

export default class APITestCase extends TestCase {
  private moviesFreak: MoviesFreakAppTest;

  database: Database;
  imdb: IMDB;

  setUp() {
    super.setUp();

    this.database = getDatabase(config.database.driver);
    this.imdb = imdbFactory(config.imdb);

    this.buildTestApp(this.database, this.imdb);
  }

  async simulatePost<T>(params: PostRequestParams): Promise<T> {
    const {
      payload = {},
      statusCode = 201,
      ...requestParams
    } = params;

    const { body } = await this.initRequest(RequestVerb.POST, requestParams)
      .send(payload)
      .expect(statusCode);

    return body;
  }

  async simulateGet<T>(params: GetRequestParams): Promise<T> {
    const {
      query = {},
      statusCode = 200,
      ...requestParams
    } = params;

    const { body } = await this.initRequest(RequestVerb.GET, requestParams)
      .query(query)
      .expect(statusCode);

    return body;
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
}

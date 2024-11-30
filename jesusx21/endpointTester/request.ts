import axios from 'axios';
import { isNil } from 'lodash';

import {
  GetParams,
  Json,
  Method,
  PostParams,
  RequestParams
} from './types';

export default class Request {
  readonly api: string;

  constructor(api: string) {
    this.api = api;
  }

  async get(params: GetParams) {
    return this.request(Method.GET, params);
  }

  async post(params: PostParams) {
    return this.request(Method.POST, params);
  }

  private async request(method: Method, params: RequestParams) {
    const endpoint = params.endpoint.startsWith('/')
      ? params.endpoint.substring(1)
      : params.endpoint;

    const url = `${this.api}/${endpoint}`;
    const { headers = {} } = params;

    const requestData: Json = {
      method,
      url,
      headers: {
        ...headers,
        Authorization: params.authentication
      }
    };

    if (method === Method.POST) requestData.data = JSON.stringify(params.body);
    if (method === Method.GET) requestData.params = params.query;

    try {
      const response = await axios(requestData);

      return response.data;
    } catch (error) {
      if (isNil(error?.response?.data)) throw error;

      return error.response.data;
    }
  }
}

import axios from 'axios';
import { isNil } from 'lodash';

import {
  GetParams,
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
    const data = params.body ?? params.query;
    const { headers = {} } = params;

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: {
          ...headers,
          Authorization: params.authentication
        }
      });

      return response.data;
    } catch (error) {
      if (isNil(error?.response?.data)) throw error;

      return error.response.data;
    }
  }
}

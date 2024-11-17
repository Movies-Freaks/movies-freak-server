export enum Method {
  GET = 'get',
  POST = 'post'
};

export type Json = {
  [key: string]: any
};

type BaseRequestParams = {
  endpoint: string,
  authentication?: string,
  headers?: Json
}

export type PostParams = BaseRequestParams & {
  body?: Json
};

export type GetParams = BaseRequestParams & {
  query?: Json
};

export type RequestParams = PostParams & GetParams;

export enum ErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
};

export enum HTTPStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  UNEXPECTED_ERROR = 500
};

export enum Tokens {
  ON_GET = 'onGet',
  ON_POST = 'onPost',
  ON_PUT = 'onPut',
  ON_DELETE = 'onDelete'
};

export enum Verb {
  DELETE = 'delete',
  GET = 'get',
  POST = 'post',
  PUT = 'put'
};

export type Json = {
  [key: string]: any
};

export type APIError = {
  code: string,
  error?: Json
};

export type BoardGameErrorParams = {
  error?: any,
  message?: string,
  info?: Json,
};

export type Endpoint = {
  [resource: string]: EndpointParams[];
};

export type EndpointParams = {
  path: string,
  resourceInstance: any,
  middlewares: Function[]
};

export type Middleware = (req: Request, app: any, resourceInstance: any) => void | Promise<void>;

export type Request = {
  body: Json;
  params: Json;
  query: Json;
};

export type Response = {
  status: HTTPStatusCode,
  data: Json
};

export type SpecifedJson<T> = {
  [key: string]: T
};

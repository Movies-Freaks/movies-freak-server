import { Json } from './types';

export type ErrorParams = {
  error?: any,
  info?: Json,
  message?: string
};

export default class MoviesFreakError extends Error {
  name: string;
  message: string;
  cause?: Json;
  info?: Json;

  constructor(params: ErrorParams = {}) {
    super();

    this.name = this.constructor.name;
    this.message = params.message ?? 'Something unexpected happened.';
    this.info = params.info ?? {};

    if (params.error) this.cause = params.error;
  }
}

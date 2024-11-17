import { Json } from './types';

export type ErrorParams = {
  error?: any,
  info?: Json,
  message?: string
};

export default class MoviesFreakError extends Error {
  message: string;
  cause?: Json;
  info?: Json;

  constructor(params: ErrorParams = {}) {
    super();

    this.message = params.message ?? 'Something unexpected happened.';
    this.info = params.info ?? {};

    if (params.error) this.cause = params.error;
  }

  get name() {
    return this.constructor.name;
  }
}

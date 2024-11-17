import { BoardGameError } from './errors';
import { APIError, ErrorCodes, HTTPStatusCode } from './types';

type ErrorData = {
  name: string,
  message: string,
  [key: string]: any
};

export class HTTPError extends BoardGameError {
  private code: string;
  private causeHidden: boolean;
  private errorData: ErrorData;

  readonly statusCode: HTTPStatusCode

  constructor(statusCode: HTTPStatusCode, code: string, error?: Error) {
    super({ error });

    this.code = code;
    this.statusCode = statusCode;
    this.causeHidden = false;

    if (error) {
      this.errorData = {
        ...error,
        name: error.name,
        message: error.message
      };
    }
  }

  get payload() {
    const payload: APIError = { code: this.code };

    if (!this.causeHidden && this.cause) {
      payload.error = this.errorData;
    }

    return payload;
  }

  showCause() {
    this.causeHidden = false;
  }

  hideCause() {
    this.causeHidden = true;
  }
}

export class HTTPBadInput extends HTTPError {
  constructor(code: string = ErrorCodes.BAD_REQUEST, cause?: Error) {
    super(HTTPStatusCode.BAD_REQUEST, code, cause);
  }
}

export class HTTPNotFound extends HTTPError {
  constructor(code: string = ErrorCodes.NOT_FOUND, cause?: Error) {
    super(HTTPStatusCode.NOT_FOUND, code, cause);
  }
}

export class HTTPConflict extends HTTPError {
  constructor(code: string = ErrorCodes.CONFLICT, cause?: Error) {
    super(HTTPStatusCode.CONFLICT, code, cause);
  }
}

export class HTTPInternalError extends HTTPError {
  constructor(error: Error) {
    super(HTTPStatusCode.UNEXPECTED_ERROR, ErrorCodes.UNEXPECTED_ERROR, error);
  }
}

export class HTTPUnauthorized extends HTTPError {
  constructor(code: string = ErrorCodes.UNAUTHORIZED) {
    super(HTTPStatusCode.UNAUTHORIZED, code);
  }
}

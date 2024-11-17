import { ClasspuccinoErrorParams } from './type';

export class ClasspuccinoError extends Error {
  readonly cause?: Error;
  readonly info?: {};

  constructor(args: ClasspuccinoErrorParams = {}) {
    super(args.message || 'Something unexpected happened');

    this.name = args.name || this.constructor.name;
    this.cause = args.error;
    this.info = args.info || {};
  }
}

export class AssertionError extends ClasspuccinoError {
  constructor(message = 'Assertion Error') {
    super({ message });
  }
}

import { BoardGameErrorParams, Json } from './types';

export class BoardGameError extends Error {
  readonly cause?: Error;
  readonly info?: Json;

  constructor(params: BoardGameErrorParams = {}) {
    super(params.message || 'Something unexpected happened');

    this.name = this.constructor.name;
    this.cause = params.error;
    this.info = params.info ?? {};
  }
}

export class MonopolyError extends BoardGameError {
  constructor(args: BoardGameErrorParams = {}) {
    super(args);
  }
}

export class TokenNotUsed extends MonopolyError {
  constructor() {
    super({ message: 'Monopoly token not used' });
  }
}

export class TitleNotFound extends MonopolyError {
  constructor(titleName: string) {
    super({
      message: `Monopoly title "${titleName}" was not found`,
      info: { titleName }
    });
  }
}

export class TokenNotSupported extends MonopolyError {
  constructor(tokenName: string) {
    super({
      message: `Monopoly token "${tokenName}" is not supported`,
      info: { tokenName }
    });
  }
}

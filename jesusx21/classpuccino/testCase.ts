import Logger from 'jesusx21/logger';

import Assertions from './assertions';

abstract class TestCase {
  private assertions: Assertions;
  readonly logger: Logger;

  constructor() {
    this.assertions = new Assertions();
    this.logger = new Logger({ timestamp: true });
  }

  abstract setUp(): void | Promise<void>;
  abstract tearDown(): void | Promise<void>;

  assertThat(actual: any) {
    return this.assertions.assertThat(actual);
  }
}

export default TestCase;

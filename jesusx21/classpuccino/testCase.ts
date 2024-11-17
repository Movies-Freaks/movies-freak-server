import Assertions from './assertions';

abstract class TestCase {
  private assertions: Assertions;

  constructor() {
    this.assertions = new Assertions();
  }

  abstract setUp(): void | Promise<void>;
  abstract tearDown(): void | Promise<void>;

  assertThat(actual: any) {
    return this.assertions.assertThat(actual);
  }
}

export default TestCase;

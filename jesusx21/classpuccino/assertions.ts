import { difference, isEqual, isNil } from 'lodash';
import { AssertionError } from './errors';

class Assertions {
  private actual?: any;

  assertThat(actual: any) {
    this.actual = actual;

    return this;
  }

  isGreaterThan(expected: any) {
    if (this.actual > expected) {
      return true;
    }

    throw new AssertionError(
      `Expect actual (${this.actual}) to be greater than expected (${expected})`
    );
  }

  isLessThanOrEqual(expected: any) {
    if (this.actual <= expected) {
      return true;
    }

    throw new AssertionError(
      `Expect actual (${this.actual}) to be less than or equal to expected (${expected})`
    );
  }

  isEqual(expected: any) {
    if (isEqual(this.actual, expected)) {
      return true;
    }

    throw new AssertionError(
      `Expected ${this.actual} to be equal to ${expected}`
    );
  }

  isNotEqual(expected: any) {
    if (!isEqual(this.actual, expected)) {
      return true;
    }

    throw new AssertionError(
      `Expected ${this.actual} to not be equal to ${expected}`
    );
  }

  isEmpty() {
    if (Object.values(this.actual).length === 0) {
      return true;
    }

    throw new AssertionError(
      `Expected ${typeof this.actual} to be empty`
    );
  }

  isInstanceOf(klass: Function) {
    if (this.actual instanceof klass) {
      return true;
    }

    throw new AssertionError(
      `Expected value to be instance of ${klass}`
    );
  }

  async willBeRejectedWith(errorKlass: Function) {
    try {
      await this.actual;

      throw new AssertionError('Expected async function to be rejected, but was successful');
    } catch (error: any) {
      if (!(error instanceof Error)) {
        throw new AssertionError(
          `Error throw ${error} is not an instance of any Error class`
        );
      }

      if (error instanceof errorKlass) {
        return error;
      }

      if (error instanceof AssertionError) {
        throw error;
      }

      throw new AssertionError(
        `Expected async function to be rejected with ${errorKlass.name} `
          + `but was rejected with ${error.constructor.name}`
      );
    }
  }

  willThrow(errorKlass: Function) {
    try {
      this.actual();

      throw new AssertionError(
        `Expected sync function to throw ${errorKlass.name}, but was successful`
      );
    } catch (error: any) {
      if (error instanceof errorKlass) {
        return error;
      }

      if (error instanceof AssertionError) {
        throw error;
      }

      throw new AssertionError(
        `Expected sync function to throw ${errorKlass.name} but it thrown ${error.constructor.name}`
      );
    }
  }

  isTrue() {
    if (this.actual === true) {
      return true;
    }

    throw new AssertionError(`Expected value to be true, but is ${this.actual}`);
  }

  isFalse() {
    if (this.actual === false) {
      return true;
    }

    throw new AssertionError(`Expected value to be false, but is ${this.actual}`);
  }

  doesExist() {
    if (!isNil(this.actual)) {
      return true;
    }

    throw new AssertionError('Expected value to exist');
  }

  doesNotExist() {
    if (isNil(this.actual)) {
      return true;
    }

    throw new AssertionError('Expected value to not exist');
  }

  isNull() {
    if (this.actual === null) {
      return true;
    }

    throw new AssertionError('Expected value to be null');
  }

  hasLengthOf(length: number) {
    const actualLength = Object.values(this.actual).length;

    if (actualLength === length) {
      return true;
    }

    throw new AssertionError(
      `Expected ${typeof this.actual} to have a length of '${length}' `
        + `but has a length of '${actualLength}'`
    );
  }

  hasSubstring(substr: string) {
    if (typeof this.actual !== 'string') {
      throw new AssertionError(`Expected ${this.actual} to be a string`);
    }

    if (this.actual.includes(substr)) {
      return true;
    }

    throw new AssertionError(`Expected ${this.actual} to have a substring '${substr}'`);
  }

  hasKeys(...args: string[]) {
    if (difference(args, Object.keys(this.actual)).length === 0) {
      return true;
    }

    throw new AssertionError(
      `Expected ${JSON.stringify(this.actual)} to have a keys ${JSON.stringify(args)}`
    );
  }
}

export default Assertions;

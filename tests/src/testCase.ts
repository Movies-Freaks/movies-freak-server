import sinon from 'sinon';
import { v4 as uuid } from 'uuid';

import { TestCase as ClasspuccinoTestCase } from 'jesusx21/classpuccino';

import getDatabase, { Database } from 'database';
import { Class, UUID } from 'types';
import { DatabaseDriver } from 'config/types';

class SandboxNotInitialized extends Error {
  get name() {
    return 'SandboxNotInitialized';
  }
}

export default class TestCase extends ClasspuccinoTestCase {
  private sandbox?: sinon.SinonSandbox;

  setUp() {
    this.createSandbox();
  }

  tearDown() {
    this.restoreSandbox();
  }

  createSandbox() {
    if (this.sandbox) {
      return this.sandbox;
    }

    this.sandbox = sinon.createSandbox();

    return this.sandbox;
  }

  generateUUID(): UUID {
    return uuid();
  }

  getDatabase(): Database {
    return getDatabase(DatabaseDriver.MEMORY);
  }

  mockClass(klass: Class, functionType = 'instance') {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    const target = functionType === 'instance' ? klass.prototype : klass;

    return this.sandbox.mock(target);
  }

  mockDate(year: number, month: number, day: number) {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    const date = new Date(year, month - 1, day);

    return this.sandbox.useFakeTimers(date);
  }

  mockFunction(instance: any, functionName: string) {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    return this.sandbox.mock(instance)
      .expects(functionName);
  }

  restoreSandbox() {
    if (!this.sandbox) {
      return;
    }

    this.sandbox.restore();

    delete this.sandbox;
  }

  stubFunction(target: any, functionName: string) {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    return this.sandbox.stub(target, functionName);
  }
}

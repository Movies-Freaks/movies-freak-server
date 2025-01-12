import sinon from 'sinon';
import { isNil } from 'lodash';
import { TestCase as ClasspuccinoTestCase } from 'jesusx21/classpuccino';
import { v4 as uuid } from 'uuid';

import Fixtures from './fixtures';
import { Resources } from './fixtures/type';

import getDatabase, { Database } from 'database';
import Entity from 'moviesFreak/entities/entity';
import { Class, UUID } from 'types';
import { DatabaseDriver } from 'config/types';

class SandboxNotInitialized extends Error {
  get name() {
    return 'SandboxNotInitialized';
  }
}

 // TODO: VALIDATE ENV FILE EXISTENCE
export default class TestCase extends ClasspuccinoTestCase {
  private sandbox?: sinon.SinonSandbox;
  protected database?: Database;

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

  getDatabase(driver?: DatabaseDriver) {
    if (isNil(this.database)) {
      this.database = getDatabase(driver ?? DatabaseDriver.MEMORY);
    }

    return this.database;
  }

  removeDatabase() {
    this.database = undefined;
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

  loadFixture<T = Entity>(resource?: Resources): Promise<T[]> {
    const database = this.getDatabase();
    const fixtures = new Fixtures(database);

    return fixtures.load(resource) as any;
  }
}

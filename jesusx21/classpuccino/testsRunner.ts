/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { ErrorAndFails, FailTestResponse } from './type';

class TestRunner {
  private testDir: string;
  private errorAndFails: ErrorAndFails;
  private totalPassed: number;
  private totalFailed: number;
  private totalErrors: number;

  constructor(testDir: string) {
    this.testDir = testDir;

    this.errorAndFails = {};

    this.totalPassed = 0;
    this.totalFailed = 0;
    this.totalErrors = 0;
  }

  async run() {
    const testFilesPath = await this.getTestFilesPath();

    // eslint-disable-next-line no-restricted-syntax
    for (const testFileDir of testFilesPath) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const TestClases = require(testFileDir);

      const testModule = testFileDir.split('../../')[1]
        .split('.')[0]
        .split('/')
        .join('.');

      this.errorAndFails[testModule] = {};

      // eslint-disable-next-line no-restricted-syntax
      for (const Test of Object.values(TestClases)) {
        // eslint-disable-next-line no-await-in-loop
        await this.runTest(Test, testModule);
      }
    }

    Object.keys(this.errorAndFails).forEach((testModule) => {
      Object.keys(this.errorAndFails[testModule]).forEach((testClassName) => {
        Object.keys(this.errorAndFails[testModule][testClassName]).forEach(functionName => {
          const { fail, error }: FailTestResponse = (
            this.errorAndFails[testModule][testClassName][functionName]
          );

          if (fail) {
            console.log(`\n${testClassName}.${functionName}`.yellow);
            console.log('Fail:'.gray, fail.stack?.gray);
          }

          if (error) {
            console.log(`\n${testClassName}.${functionName}`.red);
            console.log('Error:'.gray, error.stack?.gray);
          }
        });
      });
    });

    console.info('\n');
    console.info(`Tests passed: ${this.totalPassed}`.green);
    console.info(`Tests failed: ${this.totalFailed}`.yellow);
    console.error(`Error on tests: ${this.totalErrors}`.red);
  }

  private async runTest(Test: any, testModule: string) {
    colors.enable;

    const test = new Test();
    const testClassName = test.constructor.name;

    if (!testClassName.endsWith('Test')) {
      return;
    }

    const functions = Object.getOwnPropertyNames(Test.prototype);

    this.errorAndFails[testModule][testClassName] = {};

    console.log(`\n${testModule}.${test.constructor.name}`.gray.bold);
    // eslint-disable-next-line no-restricted-syntax
    for (const functionName of functions) {
      if (!functionName.startsWith('test')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      this.errorAndFails[testModule][testClassName][functionName] = {};

      try {
        await test.setUp();
        await test[functionName]();
        await test.tearDown();

        console.log(`${functionName.padEnd(99, '.')}.ok`.green);

        this.totalPassed += 1;
      } catch (error: any) {
        await test.tearDown();

        if (error.constructor.name === 'AssertionError') {
          console.log(`${functionName.padEnd(99, '.')}.fail`.yellow);

          this.errorAndFails[testModule][testClassName][functionName].fail = error;
          this.totalFailed += 1;
        } else {
          console.log(`${functionName.padEnd(99, '.')}.error`.red);
          this.errorAndFails[testModule][testClassName][functionName].error = error;
          this.totalErrors += 1;
        }
      }
    }
  }

  private async getTestFilesPath(testDir?: string) {
    const testPath = testDir || this.testDir;
    const directoryPath = path.join(__dirname, `${testPath}`);

    if (directoryPath.endsWith('.test.js') || directoryPath.endsWith('.test.ts')) {
      return [testPath];
    }

    const folders = fs.readdirSync(directoryPath);

    let testFiles: string[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const folder of folders) {
      if (folder.endsWith('.test.js') || folder.endsWith('.test.ts')) {
        testFiles.push(`${testPath}/${folder}`);

        // eslint-disable-next-line no-continue
        continue;
      }

      if (folder.includes('.')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      const files = await this.getTestFilesPath(`${testPath}/${folder}`);

      testFiles = [...testFiles, ...files];
    }

    return testFiles;
  }
}

export default TestRunner;

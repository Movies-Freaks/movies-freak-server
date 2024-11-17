/* eslint-disable no-console */
import path from 'path';

import TestRunner from './testsRunner';

const directoryPath = path.join('../../', process.argv[2]);
const testRunner = new TestRunner(directoryPath);

const reject = (error: any) => {
  console.info('Error runing tests');
  console.error('Error:', error);
  process.exit(1);
};

testRunner.run()
  .catch(reject);

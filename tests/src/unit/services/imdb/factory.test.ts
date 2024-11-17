import TestCase from 'tests/src/testCase';

import config from 'config';
import imdbFactory from 'services/imdb/factory';
import LocalIMDBGateway from 'services/imdb/local';
import OMDBGateway from 'services/imdb/omdb';
import { IMDBDriver } from 'config/types';
import { IMDBDriverNotSupported, MissingIMDBCredentials } from 'services/imdb/errors';

export class IMDBFactoryTest extends TestCase {
  testReturnLocalGateway() {
    const gateway = imdbFactory({ driver: IMDBDriver.LOCAL });

    this.assertThat(gateway).isInstanceOf(LocalIMDBGateway);
  }

  testReturnOMDBGateway() {
    const config = {
      driver: IMDBDriver.OMDB,
      omdb: {
        host: 'http://fake-host.com',
        apiKey: 'fake-api-key'
      }
    }
    const gateway = imdbFactory(config);

    this.assertThat(gateway).isInstanceOf(OMDBGateway);
  }

  testThrowErrorWhenCredentialsForOMDBAreNotSent() {
    this.assertThat(
      () => imdbFactory({ ...config.imdb, driver: IMDBDriver.OMDB })
    ).willThrow(MissingIMDBCredentials)
  }

  testThrowErrorOnUnsupportedDriver() {
    this.assertThat(
      () => imdbFactory({ driver: 'invalid-driver' as IMDBDriver })
    ).willThrow(IMDBDriverNotSupported);
  }
}

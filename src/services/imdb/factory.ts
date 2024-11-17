import LocalIMDBGateway from './local';
import OMDBGateway from './omdb';
import { IMDB } from './types';
import { IMDBConfig, IMDBDriver } from 'config/types';
import { IMDBDriverNotSupported, MissingIMDBCredentials } from './errors';

export default function imdbFactory(config: IMDBConfig): IMDB {
  if (config.driver === IMDBDriver.LOCAL) return new LocalIMDBGateway();

  if (config.driver === IMDBDriver.OMDB) {
    if (!config.omdb.host || !config.omdb.apiKey) {
      throw new MissingIMDBCredentials();
    }

    return new OMDBGateway(config.omdb);
  }

  throw new IMDBDriverNotSupported(config.driver);
}

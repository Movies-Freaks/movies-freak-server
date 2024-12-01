import { HTTPInternalError, HTTPNotFound, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import WatchHubs from 'moviesFreak/watchHubs';
import { Database } from 'database';
import { UUID } from 'types';
import { WatchHub } from 'moviesFreak/entities';
import { WatchHubNotFound } from 'moviesFreak/watchHubs/errors';
import { WatchHubSchema } from 'database/schemas';

export default class WatchHubResource extends Monopoly {
  async onGet(request: Request): Promise<Response<WatchHubSchema>> {
    const database: Database = this.getTitle('database');
    const { watchHubId }: { watchHubId?: UUID } = request.params ?? {};

    const getWatchHubById = new WatchHubs.GetById(database, watchHubId);

    let watchHub: WatchHub;

    try {
      watchHub = await getWatchHubById.execute();
    } catch (error) {
      if (error instanceof WatchHubNotFound) throw new HTTPNotFound('WATCH_HUB_NOT_FOUND', error);

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: watchHub
    };
  }
}

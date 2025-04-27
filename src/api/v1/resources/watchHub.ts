import { HTTPInternalError, HTTPNotFound, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import WatchHubs from 'moviesFreak/watchHubs';
import { Database } from 'database';
import { UUID } from 'types';
import { WatchHub } from 'moviesFreak/entities';
import { WatchHubNotFound as WatchHubDoesNotExist } from 'moviesFreak/watchHubs/errors';
import { WatchHubSchema } from 'database/schemas';
import { WatchHubNotFound } from 'database/stores/errors';

export default class WatchHubResource extends Monopoly {
  async onGet(request: Request): Promise<Response<WatchHubSchema>> {
    const database: Database = this.getTitle('database');
    const { watchHubId }: { watchHubId?: UUID } = request.params ?? {};

    const getWatchHubById = new WatchHubs.GetById(database, watchHubId);

    let watchHub: WatchHub;

    try {
      watchHub = await getWatchHubById.execute();
    } catch (error) {
      if (error instanceof WatchHubDoesNotExist) {
        throw new HTTPNotFound('WATCH_HUB_NOT_FOUND', error);
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: watchHub
    };
  }

  async onPut(request: Request): Promise<Response<WatchHubSchema>> {
    const database: Database = this.getTitle('database');
    const { watchHubId }: { watchHubId?: UUID } = request.params ?? {};
    // TODO: Validate request body
    const { body } = request;

    let result: WatchHub;

    try {
      const watchHub = await database.watchHubs.findById(watchHubId);

      watchHub.name = body.name;
      watchHub.description = body.description;
      watchHub.privacy = body.privacy;

      result = await database.watchHubs.update(watchHub);
    } catch (error) {
      if (error instanceof WatchHubNotFound) throw new HTTPNotFound('WATCH_HUB_NOT_FOUND', error);

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: result
    };
  }
}

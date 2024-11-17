import { HTTPBadInput, HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import CreateWatchHub from 'moviesFreak/createWatchHub';
import { Database } from 'database';
import { WatchHub, WatchHubPrivacy } from 'moviesFreak/entities';

const VALID_PRIVACIES = Object.values(WatchHubPrivacy);

export default class WatchHubsResource extends Monopoly {
  async onPost(request: Request): Promise<Response> {
    const database: Database = this.getTitle('database');
    const { name, privacy, description } = request.body;

    console.log(VALID_PRIVACIES)

    if (!VALID_PRIVACIES.includes(privacy)) throw new HTTPBadInput('PRIVACY_NOT_SUPPORTED');

    const createWatchHub = new CreateWatchHub(database, name, privacy, description);

    let watchHub: WatchHub;

    try {
      watchHub = await createWatchHub.execute();
    } catch (error) {
      // TODO: Report error
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.CREATED,
      data: watchHub
    };
  }
}

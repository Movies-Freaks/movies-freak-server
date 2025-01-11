import { HTTPBadInput, HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';
import { isEmpty } from 'lodash';

import WatchHubs from 'moviesFreak/watchHubs';
import Pagination from 'api/pagination';
import { Database } from 'database';
import { Json } from 'types';
import { WatchHub, WatchHubPrivacy } from 'moviesFreak/entities';
import { WatchHubList } from '../types';
import { WatchHubSchema } from 'database/schemas';

const VALID_PRIVACIES = Object.values(WatchHubPrivacy);

export default class WatchHubsResource extends Monopoly {
  async onPost(request: Request): Promise<Response<WatchHubSchema>> {
    const database: Database = this.getTitle('database');
    const { name, privacy, description } = request.body;

    if (!VALID_PRIVACIES.includes(privacy)) throw new HTTPBadInput('PRIVACY_NOT_SUPPORTED');

    const createWatchHub = new WatchHubs.Create(database, name, privacy, description);

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

  async onGet(request: Request): Promise<Response<WatchHubList>> {
    const database: Database = this.getTitle('database');
    const { query } = request;
    const page = isEmpty(query.page) ? query.page : Number(query.page);
    const perPage = isEmpty(query.perPage) ? query.perPage : Number(query.perPage);

    const pagination = new Pagination(page, perPage);

    if (pagination.page < 1) throw new HTTPBadInput('INVALID_PAGE');
    if (pagination.perPage < 1) throw new HTTPBadInput('INVALID_PER_PAGE');

    const getWatchHubs = new WatchHubs.GetList(
      database,
      pagination.limit,
      pagination.skip,
      query.sort
    );

    let result: Json;

    try {
      result = await getWatchHubs.execute();
    } catch (error) {
      // TODO: Report error
      throw new HTTPInternalError(error);
    }

    pagination.setTotalItems(result.totalItems);

    return {
      status: HTTPStatusCode.OK,
      data: {
        items: result.items,
        totalItems: pagination.totalItems,
        pagination: {
          page: pagination.page,
          perPage: pagination.perPage,
          totalPages: pagination.totalPages
        }
      }
    };
  }
}

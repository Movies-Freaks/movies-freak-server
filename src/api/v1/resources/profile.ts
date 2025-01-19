import { HTTPInternalError, Monopoly } from 'jesusx21/boardGame';
import { HTTPStatusCode, Request, Response } from 'jesusx21/boardGame/types';

import { User } from 'moviesFreak/entities';
import { UserSchema } from 'database/schemas';
import { isNil } from 'lodash';

export default class ProfileResource extends Monopoly {
  async onGet(_request: Request): Promise<Response<UserSchema>> {
    const user = this.getTitle('user') as User;

    if (isNil(user)) {
      throw new HTTPInternalError();
    }

    return {
      status: HTTPStatusCode.OK,
      data: {
        id: user.id,
        birthdate: user.birthdate,
        email: user.email,
        name: user.name,
        firstLastName: user.firstLastName,
        secondLastName: user.secondLastName,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
}

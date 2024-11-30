import { isEmpty, set } from 'lodash';
import { Request } from 'jesusx21/boardGame/types';

import { SortOrder } from 'database/stores/types';

export default function parseQuerySort(req: Request, _resourceInstance?: any) {
  const sort: string = req.query?.sort ?? '';

  if (isEmpty(sort)) return;

  const sortParsed = sort.split(',')
    .reduce((prev, item) => {
      let field = item;
      let order = SortOrder.ASC;

      if (item.startsWith('-')) {
        field = field.slice(1);
        order = SortOrder.DESC;
      }

      return { ...prev, [field]: order };
    }, {});

  set(req, 'query.sort', sortParsed);
}

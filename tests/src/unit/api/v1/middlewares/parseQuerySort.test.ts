import { Request } from 'jesusx21/boardGame/types';
import APITestCase from '../../apiTestCase';
import parseQuerySort from 'api/v1/middlewares/parseQuerySort';

export class ParseQuerySortTest extends APITestCase {
  protected request: Request;

  setUp() {
    this.request = { query: {} } as Request;
  }

  testReturnsAscendentSortField() {
    this.request.query.sort = 'name';

    parseQuerySort(this.request);

    this.assertThat(this.request.query.sort).isEqual({ name: 'asc' });
  }

  testReturnsDescendentSortField() {
    this.request.query.sort = '-name';

    parseQuerySort(this.request);

    this.assertThat(this.request.query.sort).isEqual({ name: 'desc' });
  }

  testReturnsSortForMultipleFields() {
    this.request.query.sort = '-name,status,-type';

    parseQuerySort(this.request);

    this.assertThat(this.request.query.sort).isEqual({
      name: 'desc',
      status: 'asc',
      type: 'desc'
    });
  }

  testReturnEmptyWhenSortIsNotSend() {
    parseQuerySort(this.request);

    this.assertThat(this.request.query.sort).isUndefined();
  }
}

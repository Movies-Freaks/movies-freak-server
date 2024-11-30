import Request from './request';
import { RequestParams, Method } from './types';

function runRequest(verb: Method, requestData: RequestParams) {
  const request = new Request('http://127.0.0.1:9000/api/v1');

  request[verb](requestData)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}

runRequest(
  Method.GET,
  {
    endpoint: '/watchHubs',
    query: {
      page: 2,
      perPage: 2,
      sort: '-name'
    }
  }
);

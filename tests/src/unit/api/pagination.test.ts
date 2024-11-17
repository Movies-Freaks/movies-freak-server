import Pagination from 'api/pagination';
import TestCase from 'tests/src/testCase';

export class PaginationTest extends TestCase {
  testSetPageDefault() {
    let page: number;
    const perPage = 10;

    const pagination = new Pagination(page, perPage);


    this.assertThat(pagination.page).isEqual(1);
  }

  testSetPerPageDefault() {
    let perPage: number;
    const page = 2;

    const pagination = new Pagination(page, perPage);

    this.assertThat(pagination.perPage).isEqual(25);
  }

  testSetValuesSentWithoutTotalPage() {
    const pagination = new Pagination(2, 10);

    this.assertThat(pagination.page).isEqual(2);
    this.assertThat(pagination.perPage).isEqual(10);
    this.assertThat(pagination.totalPages).isUndefined;
  }

  testSetValuesSentWithTotalPage() {
    const pagination = new Pagination(2, 10, 50);

    this.assertThat(pagination.page).isEqual(2);
    this.assertThat(pagination.perPage).isEqual(10);
    this.assertThat(pagination.totalPages).isEqual(50);
  }

  testCalculatesLimit() {
    const pagination = new Pagination(2, 10);

    this.assertThat(pagination.skip).isEqual(10);
  }

  testCalculatesSkip() {
    const pagination = new Pagination(2, 10);

    this.assertThat(pagination.limit).isEqual(10);
  }

  testSetTotalItems() {
    const pagination = new Pagination(2, 10);

    pagination.setTotalItems(500);

    this.assertThat(pagination.totalItems).isEqual(500);
    this.assertThat(pagination.totalPages).isEqual(50);
  }
}

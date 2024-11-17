const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 25;

export default class Pagination {
  readonly page: number;
  readonly perPage: number;

  totalPages: number;

  constructor(page?: number, perPage?: number, totalPages?: number) {
    this.page = page ?? DEFAULT_PAGE;
    this.perPage = perPage ?? DEFAULT_PER_PAGE;
    this.totalPages = totalPages;
  }

  get limit() {
    return this.perPage;
  }

  get skip() {
    return (this.page - 1) * this.perPage;
  }

  get totalItems() {
    return this.totalPages * this.perPage;
  }

  setTotalItems(totalItems: number) {
    this.totalPages = Math.ceil(totalItems / this.perPage);
  }
}

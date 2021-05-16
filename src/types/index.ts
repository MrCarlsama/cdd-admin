export interface Pageination<T> {
  limit: number;
  page: number;
  options?: T;
}

export interface PageinationResult<T> {
  total: number;
  currentTotal: number;
  data: T;
}

export class PageinationList<T> implements PageinationResult<T> {
  constructor(data: T) {
    this.data = data;
  }
  data: T;
  total: number = 0;
  currentTotal: number = 0;
}

export interface Pageination<T> {
  limit: number;
  page: number;
  options?: T;
}

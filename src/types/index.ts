export interface Pageination<T> {
  limit: number;
  skip: number;
  options?: T;
}

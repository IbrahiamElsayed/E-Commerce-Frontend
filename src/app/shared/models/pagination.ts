export interface Pagination<T> {
  pageInndex: number;
  pageSize: number;
  count: number;
  date: T[];
}
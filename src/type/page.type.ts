export interface Page<T> {
  data: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

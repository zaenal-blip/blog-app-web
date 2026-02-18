export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
}

export interface PagiableResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
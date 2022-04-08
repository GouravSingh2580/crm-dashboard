export interface PageInfo {
  currentPage: number;
  nextPage: number | null;
  pageCount: number;
  pageSize: number;
  prevPage: number | null;
  totalCount: number;
}

export interface ApiResponse<T> {
  data: T;
}

export type ApiListResp<T> = ApiResponse<T> & {
  pageInfo: PageInfo;
}

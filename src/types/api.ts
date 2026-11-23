/** Success envelope returned by the API. */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

/** Error envelope returned by the API. */
export interface ApiErrorBody {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

/** Standard API response envelope. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextCursor?: string;
}

import type { ApiResponse } from "@/core/auth/admin-api";
import type { BookListQuery, CatalogBook } from "@/core/books/private-api";

export type PublicBookListQuery = BookListQuery;

export type PublicBook = Omit<CatalogBook, "status" | "active">;

export type PaginatedPublicBooks = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: PublicBook[];
};

export interface PublicBooksApi {
  list(query: PublicBookListQuery): Promise<ApiResponse<PaginatedPublicBooks>>;
  get(bookId: string): Promise<ApiResponse<PublicBook>>;
}

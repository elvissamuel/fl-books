import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  BookCategory,
  BookCategoryListQuery,
  BookCategoryWriteRequest,
  PaginatedBookCategories,
} from "@/core/book-categories/category";

export interface PrivateBookCategoriesApi {
  list(
    query: BookCategoryListQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedBookCategories>>;
  create(
    request: BookCategoryWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<BookCategory>>;
  update(
    categoryId: string,
    request: BookCategoryWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<BookCategory>>;
  delete(categoryId: string, accessToken: string): Promise<ApiResponse<string>>;
}

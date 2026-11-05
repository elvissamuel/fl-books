import type { ApiResponse } from "@/core/auth/admin-api";
import type { BookCategoryListQuery, PaginatedBookCategories } from "@/core/book-categories/category";

export interface PublicBookCategoriesApi {
  list(query: BookCategoryListQuery): Promise<ApiResponse<PaginatedBookCategories>>;
}

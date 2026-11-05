import "server-only";

import type { PublicBookCategoriesApi } from "@/core/book-categories/public-api";
import { categoryListSearchParams } from "@/infrastructure/book-categories/category-list-query";
import { apiJson } from "@/infrastructure/http/api-client";

export const publicBookCategoryEndpoints = {
  list: "/api/v1/book-categories/public",
} as const;

export const publicBookCategoriesApi: PublicBookCategoriesApi = {
  list(query) {
    const search = categoryListSearchParams(query);
    return apiJson(`${publicBookCategoryEndpoints.list}?${search.toString()}`);
  },
};

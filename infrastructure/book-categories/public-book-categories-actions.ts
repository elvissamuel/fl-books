"use client";

import type { BookCategoryListQuery, PaginatedBookCategories } from "@/core/book-categories/category";
import { categoryListSearchParams } from "@/infrastructure/book-categories/category-list-query";
import { browserApi, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/book-categories/public";

export async function listPublicBookCategories(query: BookCategoryListQuery) {
  return browserApi<PaginatedBookCategories>(withSearch(list, categoryListSearchParams(query)));
}

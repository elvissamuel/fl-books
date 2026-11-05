"use client";

import type {
  BookCategory,
  BookCategoryListQuery,
  BookCategoryWriteRequest,
  PaginatedBookCategories,
} from "@/core/book-categories/category";
import { categoryListSearchParams } from "@/infrastructure/book-categories/category-list-query";
import { browserApi, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/book-categories/private";
const byId = (categoryId: string) =>
  `/api/v1/book-categories/private/${encodeURIComponent(categoryId)}`;

export async function listPrivateBookCategories(query: BookCategoryListQuery) {
  return browserApi<PaginatedBookCategories>(withSearch(list, categoryListSearchParams(query)));
}

export async function createPrivateBookCategory(request: BookCategoryWriteRequest) {
  return browserApi<BookCategory>(list, { method: "POST", json: request });
}

export async function updatePrivateBookCategory(
  categoryId: string,
  request: BookCategoryWriteRequest,
) {
  return browserApi<BookCategory>(byId(categoryId), { method: "PUT", json: request });
}

export async function deletePrivateBookCategory(categoryId: string) {
  return browserApi<string>(byId(categoryId), { method: "DELETE", allowEmptyData: true });
}

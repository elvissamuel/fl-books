"use client";

import type {
  BookListQuery,
  CatalogBook,
  CreateBookRequest,
  PaginatedBooks,
  UpdateBookRequest,
} from "@/core/books/private-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/books/private";
const byId = (bookId: string) => `/api/v1/books/private/${encodeURIComponent(bookId)}`;

function listSearch(query: BookListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  setQuery(search, "active", query.active);
  setQuery(search, "status", query.status);
  setQuery(search, "minStock", query.minStock);
  setQuery(search, "maxStock", query.maxStock);
  setQuery(search, "minPrice", query.minPrice);
  setQuery(search, "maxPrice", query.maxPrice);
  setQuery(search, "minWeightInGrams", query.minWeightInGrams);
  setQuery(search, "maxWeightInGrams", query.maxWeightInGrams);
  setQuery(search, "categoryId", query.categoryId?.trim());
  setQuery(search, "sortBy", query.sortBy?.trim());
  setQuery(search, "direction", query.direction?.trim());
  return search;
}

export async function listPrivateBooks(query: BookListQuery) {
  return browserApi<PaginatedBooks>(withSearch(list, listSearch(query)));
}

export async function createPrivateBook(request: CreateBookRequest) {
  return browserApi<CatalogBook>(list, { method: "POST", json: request });
}

export async function getPrivateBook(bookId: string) {
  return browserApi<CatalogBook>(byId(bookId));
}

export async function updatePrivateBook(bookId: string, request: UpdateBookRequest) {
  return browserApi<CatalogBook>(byId(bookId), { method: "PATCH", json: request });
}

export async function deletePrivateBook(bookId: string) {
  return browserApi<string>(byId(bookId), { method: "DELETE", allowEmptyData: true });
}

"use client";

import type { PublicBook, PublicBookListQuery, PaginatedPublicBooks } from "@/core/books/public-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/books/public";
const byId = (bookId: string) => `/api/v1/books/public/${encodeURIComponent(bookId)}`;

function listSearch(query: PublicBookListQuery) {
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

export async function listPublicBooks(query: PublicBookListQuery) {
  return browserApi<PaginatedPublicBooks>(withSearch(list, listSearch(query)));
}

export async function getPublicBook(bookId: string) {
  return browserApi<PublicBook>(byId(bookId));
}

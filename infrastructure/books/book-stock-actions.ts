"use client";

import type {
  AddBookStockRequest,
  AdjustBookStockRequest,
  BookStockListQuery,
  BookStockMovementQuery,
  BookStockSummary,
  PaginatedBookStock,
  PaginatedBookStockMovements,
} from "@/core/books/stock-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/books/private/stock";
const add = (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/add`;
const adjust = (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/adjust`;
const summary = (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/summary`;
const movements = (bookId: string) =>
  `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/movements`;

function listSearch(query: BookStockListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  for (const bookId of query.bookIds ?? []) {
    const id = bookId.trim();
    if (id) search.append("bookIds", id);
  }
  return search;
}

function movementSearch(bookId: string, query: BookStockMovementQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
    bookId: (query.bookId ?? bookId).trim(),
  });
  setQuery(search, "movementType", query.movementType?.trim());
  return search;
}

export async function addPrivateBookStock(bookId: string, request: AddBookStockRequest) {
  return browserApi<BookStockSummary>(add(bookId), { method: "POST", json: request });
}

export async function adjustPrivateBookStock(bookId: string, request: AdjustBookStockRequest) {
  return browserApi<BookStockSummary>(adjust(bookId), { method: "PATCH", json: request });
}

export async function listPrivateBookStock(query: BookStockListQuery) {
  return browserApi<PaginatedBookStock>(withSearch(list, listSearch(query)));
}

export async function getPrivateBookStockSummary(bookId: string) {
  return browserApi<BookStockSummary>(summary(bookId));
}

export async function listPrivateBookStockMovements(bookId: string, query: BookStockMovementQuery) {
  return browserApi<PaginatedBookStockMovements>(withSearch(movements(bookId), movementSearch(bookId, query)));
}

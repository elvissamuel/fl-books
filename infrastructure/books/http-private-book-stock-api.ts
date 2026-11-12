import "server-only";

import type { BookStockListQuery, BookStockMovementQuery, PrivateBookStockApi } from "@/core/books/stock-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateBookStockEndpoints = {
  list: "/api/v1/books/private/stock",
  add: (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/add`,
  adjust: (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/adjust`,
  summary: (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/summary`,
  movements: (bookId: string) => `/api/v1/books/private/stock/${encodeURIComponent(bookId)}/movements`,
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function setQuery(search: URLSearchParams, key: string, value: string | number | undefined) {
  if (value === undefined || value === "") return;
  search.set(key, String(value));
}

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

export const privateBookStockApi: PrivateBookStockApi = {
  add(bookId, request, accessToken) {
    return apiJson(
      privateBookStockEndpoints.add(bookId),
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  adjust(bookId, request, accessToken) {
    return apiJson(
      privateBookStockEndpoints.adjust(bookId),
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },

  list(query, accessToken) {
    return apiJson(
      `${privateBookStockEndpoints.list}?${listSearch(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  summary(bookId, accessToken) {
    return apiJson(privateBookStockEndpoints.summary(bookId), withAccessToken(accessToken));
  },

  movements(bookId, query, accessToken) {
    return apiJson(
      `${privateBookStockEndpoints.movements(bookId)}?${movementSearch(bookId, query).toString()}`,
      withAccessToken(accessToken),
    );
  },
};

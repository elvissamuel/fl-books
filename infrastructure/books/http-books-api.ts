import "server-only";

import type { BookListQuery, PrivateBooksApi } from "@/core/books/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateBookEndpoints = {
  list: "/api/v1/books/private",
  byId: (bookId: string) => `/api/v1/books/private/${encodeURIComponent(bookId)}`,
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

function setQuery(
  search: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined || value === "") return;
  search.set(key, String(value));
}

export function bookListSearchParams(query: BookListQuery) {
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

export const privateBooksApi: PrivateBooksApi = {
  list(query, accessToken) {
    const search = bookListSearchParams(query);
    return apiJson(
      `${privateBookEndpoints.list}?${search.toString()}`,
      withAccessToken(accessToken),
    );
  },

  create(request, accessToken) {
    return apiJson(
      privateBookEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  get(bookId, accessToken) {
    return apiJson(privateBookEndpoints.byId(bookId), withAccessToken(accessToken));
  },

  update(bookId, request, accessToken) {
    return apiJson(
      privateBookEndpoints.byId(bookId),
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },

  delete(bookId, accessToken) {
    return apiJson(
      privateBookEndpoints.byId(bookId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },
};

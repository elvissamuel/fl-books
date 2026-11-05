import "server-only";

import type { PublicBooksApi } from "@/core/books/public-api";
import { bookListSearchParams } from "@/infrastructure/books/http-books-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const publicBookEndpoints = {
  list: "/api/v1/books/public",
  byId: (bookId: string) => `/api/v1/books/public/${encodeURIComponent(bookId)}`,
} as const;

export const publicBooksApi: PublicBooksApi = {
  list(query) {
    const search = bookListSearchParams(query);
    return apiJson(`${publicBookEndpoints.list}?${search.toString()}`);
  },

  get(bookId) {
    return apiJson(publicBookEndpoints.byId(bookId));
  },
};

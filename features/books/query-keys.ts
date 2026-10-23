import type { BookListQuery } from "@/core/books/private-api";
import type { BookListParams } from "@/core/books/types";

export const booksKeys = {
  all: ["books"] as const,
  list: (params: BookListParams) => [...booksKeys.all, "list", params] as const,
  privateList: (query: BookListQuery) => [...booksKeys.all, "private", query] as const,
  detail: (bookId: string) => [...booksKeys.all, "detail", bookId] as const,
};

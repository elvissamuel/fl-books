import type { BookListParams } from "@/core/books/types";

export const booksKeys = {
  all: ["books"] as const,
  list: (params: BookListParams) => [...booksKeys.all, "list", params] as const,
};

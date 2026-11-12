import type { BookStockListQuery } from "@/core/books/stock-api";

export const bookStockKeys = {
  all: ["book-stock"] as const,
  list: (query: BookStockListQuery) => [...bookStockKeys.all, "list", query] as const,
  summary: (bookId: string) => [...bookStockKeys.all, "summary", bookId] as const,
};

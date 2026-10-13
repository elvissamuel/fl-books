"use client";

import { useQuery } from "@tanstack/react-query";
import type { BookListParams } from "@/core/books/types";
import { booksApi, listBooks } from "@/infrastructure/books/books-api";
import { booksKeys } from "@/features/books/query-keys";

export function useBooks(params: BookListParams) {
  return useQuery({
    queryKey: booksKeys.list(params),
    queryFn: () => booksApi.list(params),
    placeholderData: listBooks(params),
  });
}

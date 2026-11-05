"use client";

import { useQuery } from "@tanstack/react-query";
import type { PublicBookListQuery } from "@/core/books/public-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { booksKeys } from "@/features/books/query-keys";
import { getPublicBook, listPublicBooks } from "@/infrastructure/books/public-books-actions";

export function usePublicBooks(query: PublicBookListQuery) {
  return useQuery({
    queryKey: booksKeys.publicList(query),
    queryFn: async () => unwrapAction(await listPublicBooks(query)),
  });
}

export function usePublicBook(bookId: string) {
  return useQuery({
    queryKey: booksKeys.publicDetail(bookId),
    queryFn: async () => unwrapAction(await getPublicBook(bookId)),
    enabled: bookId.length > 0,
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AddBookStockRequest, BookStockListQuery } from "@/core/books/stock-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { bookStockKeys } from "@/features/book-stock/query-keys";
import {
  addPrivateBookStock,
  getPrivateBookStockSummary,
  listPrivateBookStock,
} from "@/infrastructure/books/book-stock-actions";

export function usePrivateBookStock(query: BookStockListQuery) {
  return useQuery({
    queryKey: bookStockKeys.list(query),
    queryFn: async () => unwrapAction(await listPrivateBookStock(query)),
  });
}

export function usePrivateBookStockSummary(bookId: string) {
  return useQuery({
    queryKey: bookStockKeys.summary(bookId),
    queryFn: async () => unwrapAction(await getPrivateBookStockSummary(bookId)),
    enabled: bookId.length > 0,
  });
}

export function useAddPrivateBookStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookId, request }: { bookId: string; request: AddBookStockRequest }) =>
      unwrapAction(await addPrivateBookStock(bookId, request)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookStockKeys.all }),
  });
}

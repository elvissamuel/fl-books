"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { BookListQuery, CreateBookRequest, UpdateBookRequest } from "@/core/books/private-api";
import type { BookListParams } from "@/core/books/types";
import {
  createPrivateBook,
  deletePrivateBook,
  getPrivateBook,
  listPrivateBooks,
  updatePrivateBook,
} from "@/infrastructure/books/books-actions";
import { booksApi, listBooks } from "@/infrastructure/books/books-api";
import { booksKeys } from "@/features/books/query-keys";

async function unwrapAction<T>(result: { ok: true; data: T } | { ok: false; message: string }) {
  if (!result.ok) throw new Error(result.message);
  return result.data;
}

export function useBooks(params: BookListParams) {
  return useQuery({
    queryKey: booksKeys.list(params),
    queryFn: () => booksApi.list(params),
    placeholderData: listBooks(params),
  });
}

export function usePrivateBooks(query: BookListQuery) {
  return useQuery({
    queryKey: booksKeys.privateList(query),
    queryFn: async () => unwrapAction(await listPrivateBooks(query)),
  });
}

export function usePrivateBook(bookId: string) {
  return useQuery({
    queryKey: booksKeys.detail(bookId),
    queryFn: async () => unwrapAction(await getPrivateBook(bookId)),
    enabled: bookId.length > 0,
  });
}

export function useCreatePrivateBook() {
  return useMutation({
    mutationFn: async (request: CreateBookRequest) => unwrapAction(await createPrivateBook(request)),
  });
}

export function useUpdatePrivateBook() {
  return useMutation({
    mutationFn: async ({ bookId, request }: { bookId: string; request: UpdateBookRequest }) =>
      unwrapAction(await updatePrivateBook(bookId, request)),
  });
}

export function useDeletePrivateBook() {
  return useMutation({
    mutationFn: async (bookId: string) => unwrapAction(await deletePrivateBook(bookId)),
  });
}

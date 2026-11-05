"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookCategoryListQuery,
  BookCategoryWriteRequest,
} from "@/core/book-categories/category";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { bookCategoryKeys } from "@/features/book-categories/query-keys";
import {
  createPrivateBookCategory,
  deletePrivateBookCategory,
  listPrivateBookCategories,
  updatePrivateBookCategory,
} from "@/infrastructure/book-categories/private-book-categories-actions";

function useRefreshBookCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: bookCategoryKeys.all });
}

export function usePrivateBookCategories(query: BookCategoryListQuery) {
  return useQuery({
    queryKey: bookCategoryKeys.privateList(query),
    queryFn: async () => unwrapAction(await listPrivateBookCategories(query)),
  });
}

export function useCreatePrivateBookCategory() {
  const refresh = useRefreshBookCategories();
  return useMutation({
    mutationFn: async (request: BookCategoryWriteRequest) =>
      unwrapAction(await createPrivateBookCategory(request)),
    onSuccess: refresh,
  });
}

export function useUpdatePrivateBookCategory() {
  const refresh = useRefreshBookCategories();
  return useMutation({
    mutationFn: async ({
      categoryId,
      request,
    }: {
      categoryId: string;
      request: BookCategoryWriteRequest;
    }) => unwrapAction(await updatePrivateBookCategory(categoryId, request)),
    onSuccess: refresh,
  });
}

export function useDeletePrivateBookCategory() {
  const refresh = useRefreshBookCategories();
  return useMutation({
    mutationFn: async (categoryId: string) =>
      unwrapAction(await deletePrivateBookCategory(categoryId)),
    onSuccess: refresh,
  });
}

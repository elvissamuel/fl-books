"use client";

import { useQuery } from "@tanstack/react-query";
import type { BookCategoryListQuery } from "@/core/book-categories/category";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { bookCategoryKeys } from "@/features/book-categories/query-keys";
import { listPublicBookCategories } from "@/infrastructure/book-categories/public-book-categories-actions";

export function usePublicBookCategories(query: BookCategoryListQuery) {
  return useQuery({
    queryKey: bookCategoryKeys.publicList(query),
    queryFn: async () => unwrapAction(await listPublicBookCategories(query)),
  });
}

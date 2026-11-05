import type { BookCategoryListQuery } from "@/core/book-categories/category";

export const bookCategoryKeys = {
  all: ["book-categories"] as const,
  privateList: (query: BookCategoryListQuery) =>
    [...bookCategoryKeys.all, "private", query] as const,
  publicList: (query: BookCategoryListQuery) =>
    [...bookCategoryKeys.all, "public", query] as const,
};

import type { BookCategoryListQuery } from "@/core/book-categories/category";

export function categoryListSearchParams(query: BookCategoryListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  const term = query.search?.trim();
  if (term) search.set("search", term);
  return search;
}

import type { BookCategory } from "@/core/books/private-api";

export type { BookCategory };

export type BookCategoryWriteRequest = {
  name: string;
  imageUrl: string;
};

export type BookCategoryListQuery = {
  page: number;
  size: number;
  search?: string;
};

export type PaginatedBookCategories = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: BookCategory[];
};

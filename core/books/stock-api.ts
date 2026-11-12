import type { ApiResponse } from "@/core/auth/admin-api";
import type { CatalogBook } from "@/core/books/private-api";

export type BookStockSummary = {
  bookId: string;
  bookTitle: string;
  openingAndInitialStock: number;
  totalRestocked: number;
  totalPurchased: number;
  totalReturned: number;
  totalAdjustmentsIn: number;
  totalAdjustmentsOut: number;
  currentAvailableStock: number;
};

export type AddBookStockRequest = {
  quantity: number;
  reason: string;
};

export type AdjustBookStockRequest = {
  newQuantity: number;
  reason: string;
};

export type BookStockListQuery = {
  page: number;
  size: number;
  search?: string;
  bookIds?: string[];
};

export type BookStockMovementQuery = {
  page: number;
  size: number;
  bookId?: string;
  movementType?: string;
};

export type BookStockCount = CatalogBook & {
  systemBestSeller: boolean;
  bestSellerOverride: boolean | null;
};

export type PaginatedBookStock = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: BookStockCount[];
};

export type PaginatedBookStockMovements = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: BookStockMovement[];
};

export type BookStockMovement = Record<string, unknown>;

export interface PrivateBookStockApi {
  add(
    bookId: string,
    request: AddBookStockRequest,
    accessToken: string,
  ): Promise<ApiResponse<BookStockSummary>>;
  adjust(
    bookId: string,
    request: AdjustBookStockRequest,
    accessToken: string,
  ): Promise<ApiResponse<BookStockSummary>>;
  list(query: BookStockListQuery, accessToken: string): Promise<ApiResponse<PaginatedBookStock>>;
  summary(bookId: string, accessToken: string): Promise<ApiResponse<BookStockSummary>>;
  movements(
    bookId: string,
    query: BookStockMovementQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedBookStockMovements>>;
}

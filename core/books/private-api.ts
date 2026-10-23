import type { ApiResponse } from "@/core/auth/admin-api";

export const bookPublicationStatuses = ["DRAFT", "AVAILABLE", "NOT_AVAILABLE", "ARCHIVED"] as const;

export type BookPublicationStatus = (typeof bookPublicationStatuses)[number];

export type BookListQuery = {
  page: number;
  size: number;
  search?: string;
  active?: boolean;
  status?: BookPublicationStatus;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;
  minWeightInGrams?: number;
  maxWeightInGrams?: number;
  categoryId?: string;
  sortBy?: string;
  direction?: string;
};

export type BookCategory = {
  id: string;
  name: string;
  imageUrl: string;
};

export type BookPickupAllocation = {
  pickupLocationId: string;
  quantity: number;
  enabled: boolean;
};

export type CatalogBook = {
  id: string;
  title: string;
  authorName: string;
  coverImageUrls: string[];
  shortDescription: string;
  description: string;
  price: number;
  weightInGrams: number;
  bestSeller: boolean;
  physicalDeliveryAvailable: boolean;
  pickupAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  category: BookCategory;
  stockQuantity: number;
  pickupAllocations: BookPickupAllocation[];
  version: number;
  status?: BookPublicationStatus;
  active?: boolean;
};

export type PaginatedBooks = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: CatalogBook[];
};

export type CreateBookRequest = {
  title: string;
  authorName: string;
  coverImageUrls: string[];
  shortDescription: string;
  description: string;
  price: number;
  weightInGrams: number;
  categoryId: string;
  stockQuantity: number;
  pickupAllocations: BookPickupAllocation[];
  physicalDeliveryAvailable: boolean;
  pickupAvailable: boolean;
  bulkPurchaseAvailable: boolean;
};

export type UpdateBookRequest = {
  title: string;
  authorName: string;
  coverImageUrls: string[];
  shortDescription: string;
  description: string;
  price: number;
  weightInGrams: number;
  physicalDeliveryAvailable: boolean;
  pickupAvailable: boolean;
  categoryId: string;
  stockQuantity: number;
  pickupAllocations: BookPickupAllocation[];
};

export interface PrivateBooksApi {
  list(query: BookListQuery, accessToken: string): Promise<ApiResponse<PaginatedBooks>>;
  create(request: CreateBookRequest, accessToken: string): Promise<ApiResponse<CatalogBook>>;
  get(bookId: string, accessToken: string): Promise<ApiResponse<CatalogBook>>;
  update(
    bookId: string,
    request: UpdateBookRequest,
    accessToken: string,
  ): Promise<ApiResponse<CatalogBook>>;
  delete(bookId: string, accessToken: string): Promise<ApiResponse<string>>;
}

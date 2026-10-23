export type BookStatus = "active" | "inactive";

export type BookListFilter =
  | "all"
  | "stock"
  | "price"
  | "weight"
  | "active"
  | "inactive";

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  price: number;
  stock: number;
  weightKg: number;
  status: BookStatus;
};

export type BookListParams = {
  search: string;
  filter: BookListFilter;
  page: number;
  pageSize: number;
};

export type BookListPage = {
  items: Book[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type PickupAllocation = {
  id: string;
  name: string;
  address: string;
  quantity: string;
  enabled: boolean;
};

export type BookDraft = {
  title: string;
  authorName: string;
  categoryId: string;
  stockQuantity: string;
  shortSummary: string;
  description: string;
  weightKg: string;
  price: string;
  coverImageUrls: string;
  inStorePickup: boolean;
  deliveryDispatch: boolean;
  bulkPurchaseAvailable: boolean;
  inventoryLimit: string;
  allocations: PickupAllocation[];
};

export interface BooksApi {
  list(params: BookListParams): Promise<BookListPage>;
}

export type CustomerStatus = "active" | "inactive";

export type CustomerListFilter = "all" | "active" | "inactive";

export type Customer = {
  id: string;
  name: string;
  initials: string;
  location: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: CustomerStatus;
};

export type CustomerListParams = {
  search: string;
  filter: CustomerListFilter;
  page: number;
  pageSize: number;
};

export type CustomerListPage = {
  items: Customer[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type CustomerPurchaseStatus = "shipped" | "delivered";

export type CustomerPurchase = {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  status: CustomerPurchaseStatus;
};

export type CustomerDetail = {
  name: string;
  initials: string;
  location: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: CustomerStatus;
  purchases: CustomerPurchase[];
};

export interface CustomersApi {
  list(params: CustomerListParams): Promise<CustomerListPage>;
  get(id: string): Promise<CustomerDetail>;
}

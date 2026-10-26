import type { ApiResponse } from "@/core/auth/admin-api";
import type { CustomerGender, PublicCustomer } from "@/core/customers/public-api";

export type AdminCustomer = PublicCustomer;

export type AdminCustomerListQuery = {
  page: number;
  size: number;
  searchParam?: string;
};

export type AdminCustomerFilter = {
  searchParam?: string;
  active?: boolean;
  verified?: boolean;
  gender?: CustomerGender;
  marketingEmailsEnabled?: boolean;
  registeredFrom?: string;
  registeredTo?: string;
};

export type AdminCustomerFilterQuery = {
  page: number;
  size: number;
  filter: AdminCustomerFilter;
};

export type PaginatedAdminCustomers = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: AdminCustomer[];
};

export interface AdminCustomersApi {
  list(
    query: AdminCustomerListQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedAdminCustomers>>;
  filter(
    query: AdminCustomerFilterQuery,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedAdminCustomers>>;
  get(customerId: string, accessToken: string): Promise<ApiResponse<AdminCustomer>>;
  delete(customerId: string, accessToken: string): Promise<ApiResponse<string>>;
  deactivate(customerId: string, accessToken: string): Promise<ApiResponse<AdminCustomer>>;
  activate(customerId: string, accessToken: string): Promise<ApiResponse<AdminCustomer>>;
}

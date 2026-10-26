import type { AdminCustomerFilterQuery, AdminCustomerListQuery } from "@/core/customers/admin-api";
import type { CustomerListParams } from "@/core/customers/types";

export const customersKeys = {
  all: ["customers"] as const,
  list: (params: CustomerListParams) => [...customersKeys.all, "list", params] as const,
  detail: (id: string) => [...customersKeys.all, "detail", id] as const,
  profile: (accessToken: string) => [...customersKeys.all, "profile", accessToken] as const,
  adminList: (query: AdminCustomerListQuery) =>
    [...customersKeys.all, "admin-list", query] as const,
  adminFilter: (query: AdminCustomerFilterQuery) =>
    [...customersKeys.all, "admin-filter", query] as const,
  adminDetail: (customerId: string) => [...customersKeys.all, "admin-detail", customerId] as const,
};

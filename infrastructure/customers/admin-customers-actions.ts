"use client";

import type {
  AdminCustomer,
  AdminCustomerFilterQuery,
  AdminCustomerListQuery,
  PaginatedAdminCustomers,
} from "@/core/customers/admin-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/customer/private/admin";
const byId = (customerId: string) =>
  `/api/v1/customer/private/admin/${encodeURIComponent(customerId)}`;

export async function listAdminCustomers(query: AdminCustomerListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParam", query.searchParam?.trim());
  return browserApi<PaginatedAdminCustomers>(withSearch(list, search));
}

export async function filterAdminCustomers(query: AdminCustomerFilterQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParam", query.filter.searchParam?.trim());
  setQuery(search, "active", query.filter.active);
  setQuery(search, "verified", query.filter.verified);
  setQuery(search, "gender", query.filter.gender);
  setQuery(search, "marketingEmailsEnabled", query.filter.marketingEmailsEnabled);
  setQuery(search, "registeredFrom", query.filter.registeredFrom);
  setQuery(search, "registeredTo", query.filter.registeredTo);
  return browserApi<PaginatedAdminCustomers>(withSearch(`${list}/filter`, search), {
    method: "POST",
  });
}

export async function getAdminCustomer(customerId: string) {
  return browserApi<AdminCustomer>(byId(customerId));
}

export async function deleteAdminCustomer(customerId: string) {
  return browserApi<string>(byId(customerId), { method: "DELETE", allowEmptyData: true });
}

export async function deactivateAdminCustomer(customerId: string) {
  return browserApi<AdminCustomer>(`${byId(customerId)}/deactivate`, { method: "PATCH" });
}

export async function activateAdminCustomer(customerId: string) {
  return browserApi<AdminCustomer>(`${byId(customerId)}/activate`, { method: "PATCH" });
}

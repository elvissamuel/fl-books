import "server-only";

import type {
  AdminCustomerFilter,
  AdminCustomerListQuery,
  AdminCustomersApi,
} from "@/core/customers/admin-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const adminCustomerEndpoints = {
  list: "/api/v1/customer/private/admin",
  filter: "/api/v1/customer/private/admin/filter",
  byId: (customerId: string) =>
    `/api/v1/customer/private/admin/${encodeURIComponent(customerId)}`,
  deactivate: (customerId: string) =>
    `/api/v1/customer/private/admin/${encodeURIComponent(customerId)}/deactivate`,
  activate: (customerId: string) =>
    `/api/v1/customer/private/admin/${encodeURIComponent(customerId)}/activate`,
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function setQuery(
  search: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined || value === "") return;
  search.set(key, String(value));
}

function listSearchParams(query: AdminCustomerListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParam", query.searchParam?.trim());
  return search;
}

function filterSearchParams(page: number, size: number, filter: AdminCustomerFilter) {
  const search = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  setQuery(search, "searchParam", filter.searchParam?.trim());
  setQuery(search, "active", filter.active);
  setQuery(search, "verified", filter.verified);
  setQuery(search, "gender", filter.gender);
  setQuery(search, "marketingEmailsEnabled", filter.marketingEmailsEnabled);
  setQuery(search, "registeredFrom", filter.registeredFrom);
  setQuery(search, "registeredTo", filter.registeredTo);
  return search;
}

export const adminCustomersApi: AdminCustomersApi = {
  list(query, accessToken) {
    return apiJson(
      `${adminCustomerEndpoints.list}?${listSearchParams(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  filter(query, accessToken) {
    const search = filterSearchParams(query.page, query.size, query.filter);
    return apiJson(
      `${adminCustomerEndpoints.filter}?${search.toString()}`,
      withAccessToken(accessToken, { method: "POST" }),
    );
  },

  get(customerId, accessToken) {
    return apiJson(adminCustomerEndpoints.byId(customerId), withAccessToken(accessToken));
  },

  delete(customerId, accessToken) {
    return apiJson(
      adminCustomerEndpoints.byId(customerId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  deactivate(customerId, accessToken) {
    return apiJson(
      adminCustomerEndpoints.deactivate(customerId),
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },

  activate(customerId, accessToken) {
    return apiJson(
      adminCustomerEndpoints.activate(customerId),
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },
};

import "server-only";

import type { OrderFilterRequest, PrivateOrdersApi } from "@/core/orders/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateOrderEndpoints = {
  checkout: "/api/v1/orders/private/checkout",
  customerFilter: "/api/v1/orders/private/customer/filter",
  filter: "/api/v1/orders/private/filter",
  calculate: "/api/v1/orders/private/calculate",
  list: "/api/v1/orders/private",
  byId: (orderId: string) => `/api/v1/orders/private/${encodeURIComponent(orderId)}`,
  customerList: "/api/v1/orders/private/customer",
  customerById: (orderId: string) =>
    `/api/v1/orders/private/customer/${encodeURIComponent(orderId)}`,
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

function listSearch(query: OrderFilterRequest) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  setQuery(search, "orderId", query.orderId?.trim());
  setQuery(search, "userId", query.userId?.trim());
  setQuery(search, "pickUpLocationId", query.pickUpLocationId?.trim());
  setQuery(search, "paymentStatus", query.paymentStatus);
  setQuery(search, "logisticsType", query.logisticsType);
  setQuery(search, "paymentProvider", query.paymentProvider?.trim());
  setQuery(search, "paymentReference", query.paymentReference?.trim());
  setQuery(search, "createdFrom", query.createdFrom?.trim());
  setQuery(search, "createdTo", query.createdTo?.trim());
  setQuery(search, "minAmount", query.minAmount);
  setQuery(search, "maxAmount", query.maxAmount);
  setQuery(search, "sortBy", query.sortBy?.trim());
  setQuery(search, "sortDirection", query.sortDirection?.trim());
  return search;
}

export const privateOrdersApi: PrivateOrdersApi = {
  checkout(request, accessToken) {
    return apiJson(
      privateOrderEndpoints.checkout,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  filterCustomer(request, accessToken) {
    return apiJson(
      privateOrderEndpoints.customerFilter,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  filter(request, accessToken) {
    return apiJson(
      privateOrderEndpoints.filter,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  calculate(request, accessToken) {
    return apiJson(
      privateOrderEndpoints.calculate,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  list(query, accessToken) {
    const path = `${privateOrderEndpoints.list}?${listSearch(query).toString()}`;
    return apiJson(path, withAccessToken(accessToken));
  },

  get(orderId, accessToken) {
    return apiJson(privateOrderEndpoints.byId(orderId), withAccessToken(accessToken));
  },

  listCustomer(query, accessToken) {
    const path = `${privateOrderEndpoints.customerList}?${listSearch(query).toString()}`;
    return apiJson(path, withAccessToken(accessToken));
  },

  getCustomer(orderId, accessToken) {
    return apiJson(privateOrderEndpoints.customerById(orderId), withAccessToken(accessToken));
  },
};

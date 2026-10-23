import "server-only";

import type {
  DeliveryOutletFilter,
  DeliveryOutletListQuery,
  PrivateDeliveryOutletsApi,
} from "@/core/pickup-stations/delivery-outlet-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateDeliveryOutletEndpoints = {
  list: "/api/v1/delivery-outlets/private",
  filter: "/api/v1/delivery-outlets/private/filter",
  statistics: "/api/v1/delivery-outlets/private/statistics",
  byId: (outletId: string) => `/api/v1/delivery-outlets/private/${encodeURIComponent(outletId)}`,
  status: (outletId: string) =>
    `/api/v1/delivery-outlets/private/${encodeURIComponent(outletId)}/status`,
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

function listSearchParams(query: DeliveryOutletListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParams", query.searchParams?.trim());
  setQuery(search, "status", query.status);
  return search;
}

function filterSearchParams(page: number, size: number, filter: DeliveryOutletFilter) {
  const search = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  setQuery(search, "searchParam", filter.searchParam?.trim());
  setQuery(search, "status", filter.status);
  setQuery(search, "country", filter.country?.trim());
  setQuery(search, "state", filter.state?.trim());
  setQuery(search, "city", filter.city?.trim());
  return search;
}

export const privateDeliveryOutletsApi: PrivateDeliveryOutletsApi = {
  list(query, accessToken) {
    return apiJson(
      `${privateDeliveryOutletEndpoints.list}?${listSearchParams(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  create(request, accessToken) {
    return apiJson(
      privateDeliveryOutletEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  filter(query, accessToken) {
    const search = filterSearchParams(query.page, query.size, query.filter);
    return apiJson(
      `${privateDeliveryOutletEndpoints.filter}?${search.toString()}`,
      withAccessToken(accessToken, { method: "POST" }),
    );
  },

  get(outletId, accessToken) {
    return apiJson(privateDeliveryOutletEndpoints.byId(outletId), withAccessToken(accessToken));
  },

  update(outletId, request, accessToken) {
    return apiJson(
      privateDeliveryOutletEndpoints.byId(outletId),
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  updateStatus(outletId, status, accessToken) {
    const search = new URLSearchParams({ status });
    return apiJson(
      `${privateDeliveryOutletEndpoints.status(outletId)}?${search.toString()}`,
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },

  delete(outletId, accessToken) {
    return apiJson(
      privateDeliveryOutletEndpoints.byId(outletId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  statistics(accessToken) {
    return apiJson(privateDeliveryOutletEndpoints.statistics, withAccessToken(accessToken));
  },
};

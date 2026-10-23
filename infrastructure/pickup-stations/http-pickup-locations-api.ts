import "server-only";

import type {
  PickupLocationFilter,
  PickupLocationListQuery,
  PrivatePickupLocationsApi,
} from "@/core/pickup-stations/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privatePickupLocationEndpoints = {
  list: "/api/v1/pickup-locations/private",
  filter: "/api/v1/pickup-locations/private/filter",
  statistics: "/api/v1/pickup-locations/private/statistics",
  byId: (locationId: string) =>
    `/api/v1/pickup-locations/private/${encodeURIComponent(locationId)}`,
  status: (locationId: string) =>
    `/api/v1/pickup-locations/private/${encodeURIComponent(locationId)}/status`,
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

function listSearchParams(query: PickupLocationListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParams", query.searchParams?.trim());
  setQuery(search, "status", query.status);
  return search;
}

function filterSearchParams(page: number, size: number, filter: PickupLocationFilter) {
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

export const privatePickupLocationsApi: PrivatePickupLocationsApi = {
  list(query, accessToken) {
    return apiJson(
      `${privatePickupLocationEndpoints.list}?${listSearchParams(query).toString()}`,
      withAccessToken(accessToken),
    );
  },

  filter(query, accessToken) {
    const search = filterSearchParams(query.page, query.size, query.filter);
    return apiJson(
      `${privatePickupLocationEndpoints.filter}?${search.toString()}`,
      withAccessToken(accessToken, { method: "POST" }),
    );
  },

  get(locationId, accessToken) {
    return apiJson(privatePickupLocationEndpoints.byId(locationId), withAccessToken(accessToken));
  },

  create(request, accessToken) {
    return apiJson(
      privatePickupLocationEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  update(locationId, request, accessToken) {
    return apiJson(
      privatePickupLocationEndpoints.byId(locationId),
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  updateStatus(locationId, status, accessToken) {
    const search = new URLSearchParams({ status });
    return apiJson(
      `${privatePickupLocationEndpoints.status(locationId)}?${search.toString()}`,
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },

  delete(locationId, accessToken) {
    return apiJson(
      privatePickupLocationEndpoints.byId(locationId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  statistics(accessToken) {
    return apiJson(privatePickupLocationEndpoints.statistics, withAccessToken(accessToken));
  },
};

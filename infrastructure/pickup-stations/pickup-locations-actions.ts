"use client";

import type {
  CreatePickupLocationRequest,
  PaginatedPickupLocations,
  PickupLocation,
  PickupLocationFilterQuery,
  PickupLocationListQuery,
  PickupLocationStatistics,
  PickupLocationStatus,
  UpdatePickupLocationRequest,
} from "@/core/pickup-stations/private-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/pickup-locations/private";
const byId = (locationId: string) =>
  `/api/v1/pickup-locations/private/${encodeURIComponent(locationId)}`;

function listSearch(query: PickupLocationListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParams", query.searchParams?.trim());
  setQuery(search, "status", query.status);
  return search;
}

function filterSearch(query: PickupLocationFilterQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParam", query.filter.searchParam?.trim());
  setQuery(search, "status", query.filter.status);
  setQuery(search, "country", query.filter.country?.trim());
  setQuery(search, "state", query.filter.state?.trim());
  setQuery(search, "city", query.filter.city?.trim());
  return search;
}

export async function listPrivatePickupLocations(query: PickupLocationListQuery) {
  return browserApi<PaginatedPickupLocations>(withSearch(list, listSearch(query)));
}

export async function filterPrivatePickupLocations(query: PickupLocationFilterQuery) {
  return browserApi<PaginatedPickupLocations>(withSearch(`${list}/filter`, filterSearch(query)), {
    method: "POST",
  });
}

export async function getPrivatePickupLocation(locationId: string) {
  return browserApi<PickupLocation>(byId(locationId));
}

export async function createPrivatePickupLocation(request: CreatePickupLocationRequest) {
  return browserApi<PickupLocation>(list, { method: "POST", json: request });
}

export async function updatePrivatePickupLocation(
  locationId: string,
  request: UpdatePickupLocationRequest,
) {
  return browserApi<PickupLocation>(byId(locationId), { method: "PUT", json: request });
}

export async function updatePrivatePickupLocationStatus(
  locationId: string,
  status: PickupLocationStatus,
) {
  const search = new URLSearchParams({ status });
  return browserApi<PickupLocation>(withSearch(`${byId(locationId)}/status`, search), {
    method: "PATCH",
  });
}

export async function deletePrivatePickupLocation(locationId: string) {
  return browserApi<string>(byId(locationId), { method: "DELETE", allowEmptyData: true });
}

export async function getPrivatePickupLocationStatistics() {
  return browserApi<PickupLocationStatistics>(`${list}/statistics`);
}

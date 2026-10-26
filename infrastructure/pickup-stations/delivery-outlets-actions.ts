"use client";

import type {
  DeliveryOutletFilterQuery,
  DeliveryOutletListQuery,
  DeliveryOutletStatistics,
  DeliveryOutletStatus,
  DeliveryOutletWriteRequest,
  PaginatedDeliveryOutlets,
  PrivateDeliveryOutlet,
} from "@/core/pickup-stations/delivery-outlet-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const list = "/api/v1/delivery-outlets/private";
const byId = (outletId: string) =>
  `/api/v1/delivery-outlets/private/${encodeURIComponent(outletId)}`;

function listSearch(query: DeliveryOutletListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "searchParams", query.searchParams?.trim());
  setQuery(search, "status", query.status);
  return search;
}

function filterSearch(query: DeliveryOutletFilterQuery) {
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

export async function listPrivateDeliveryOutlets(query: DeliveryOutletListQuery) {
  return browserApi<PaginatedDeliveryOutlets>(withSearch(list, listSearch(query)));
}

export async function createPrivateDeliveryOutlet(request: DeliveryOutletWriteRequest) {
  return browserApi<PrivateDeliveryOutlet>(list, { method: "POST", json: request });
}

export async function filterPrivateDeliveryOutlets(query: DeliveryOutletFilterQuery) {
  return browserApi<PaginatedDeliveryOutlets>(withSearch(`${list}/filter`, filterSearch(query)), {
    method: "POST",
  });
}

export async function getPrivateDeliveryOutlet(outletId: string) {
  return browserApi<PrivateDeliveryOutlet>(byId(outletId));
}

export async function updatePrivateDeliveryOutlet(
  outletId: string,
  request: DeliveryOutletWriteRequest,
) {
  return browserApi<PrivateDeliveryOutlet>(byId(outletId), { method: "PUT", json: request });
}

export async function updatePrivateDeliveryOutletStatus(
  outletId: string,
  status: DeliveryOutletStatus,
) {
  const search = new URLSearchParams({ status });
  return browserApi<PrivateDeliveryOutlet>(withSearch(`${byId(outletId)}/status`, search), {
    method: "PATCH",
  });
}

export async function deletePrivateDeliveryOutlet(outletId: string) {
  return browserApi<string>(byId(outletId), { method: "DELETE", allowEmptyData: true });
}

export async function getPrivateDeliveryOutletStatistics() {
  return browserApi<DeliveryOutletStatistics>(`${list}/statistics`);
}

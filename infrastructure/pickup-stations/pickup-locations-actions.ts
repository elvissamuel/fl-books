"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  PickupLocationFilterQuery,
  PickupLocationListQuery,
  CreatePickupLocationRequest,
  PickupLocationStatus,
  UpdatePickupLocationRequest,
} from "@/core/pickup-stations/private-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privatePickupLocationsApi } from "@/infrastructure/pickup-stations/http-pickup-locations-api";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; sessionExpired?: boolean };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    return unwrap(await task(opened.session.accessToken));
  } catch (error) {
    return adminActionFailure(error);
  }
}

function unwrap<T>(response: ApiResponse<T>): ActionResult<T> {
  if (!response.success || response.data == null) {
    return { ok: false, message: response.message || "Request failed." };
  }
  return { ok: true, data: response.data };
}

export async function listPrivatePickupLocations(query: PickupLocationListQuery) {
  return run((accessToken) => privatePickupLocationsApi.list(query, accessToken));
}

export async function filterPrivatePickupLocations(query: PickupLocationFilterQuery) {
  return run((accessToken) => privatePickupLocationsApi.filter(query, accessToken));
}

export async function getPrivatePickupLocation(locationId: string) {
  return run((accessToken) => privatePickupLocationsApi.get(locationId, accessToken));
}

export async function createPrivatePickupLocation(request: CreatePickupLocationRequest) {
  return run((accessToken) => privatePickupLocationsApi.create(request, accessToken));
}

export async function updatePrivatePickupLocation(
  locationId: string,
  request: UpdatePickupLocationRequest,
) {
  return run((accessToken) => privatePickupLocationsApi.update(locationId, request, accessToken));
}

export async function updatePrivatePickupLocationStatus(
  locationId: string,
  status: PickupLocationStatus,
) {
  return run((accessToken) => privatePickupLocationsApi.updateStatus(locationId, status, accessToken));
}

export async function deletePrivatePickupLocation(locationId: string) {
  return run((accessToken) => privatePickupLocationsApi.delete(locationId, accessToken));
}

export async function getPrivatePickupLocationStatistics() {
  return run((accessToken) => privatePickupLocationsApi.statistics(accessToken));
}

"use server";

import { unstable_rethrow } from "next/navigation";
import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  PickupLocationFilterQuery,
  PickupLocationListQuery,
  CreatePickupLocationRequest,
  PickupLocationStatus,
  UpdatePickupLocationRequest,
} from "@/core/pickup-stations/private-api";
import { requireAdminSession } from "@/infrastructure/auth/require-admin-session";
import { ApiError } from "@/infrastructure/http/api-client";
import { privatePickupLocationsApi } from "@/infrastructure/pickup-stations/http-pickup-locations-api";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  try {
    const session = await requireAdminSession();
    return unwrap(await task(session.accessToken));
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "Request failed." };
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

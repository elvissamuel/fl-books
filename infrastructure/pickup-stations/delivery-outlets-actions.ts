"use server";

import { unstable_rethrow } from "next/navigation";
import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  DeliveryOutletFilterQuery,
  DeliveryOutletListQuery,
  DeliveryOutletStatus,
  DeliveryOutletWriteRequest,
} from "@/core/pickup-stations/delivery-outlet-api";
import { requireAdminSession } from "@/infrastructure/auth/require-admin-session";
import { privateDeliveryOutletsApi } from "@/infrastructure/pickup-stations/http-delivery-outlets-api";
import { ApiError } from "@/infrastructure/http/api-client";

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

export async function listPrivateDeliveryOutlets(query: DeliveryOutletListQuery) {
  return run((accessToken) => privateDeliveryOutletsApi.list(query, accessToken));
}

export async function createPrivateDeliveryOutlet(request: DeliveryOutletWriteRequest) {
  return run((accessToken) => privateDeliveryOutletsApi.create(request, accessToken));
}

export async function filterPrivateDeliveryOutlets(query: DeliveryOutletFilterQuery) {
  return run((accessToken) => privateDeliveryOutletsApi.filter(query, accessToken));
}

export async function getPrivateDeliveryOutlet(outletId: string) {
  return run((accessToken) => privateDeliveryOutletsApi.get(outletId, accessToken));
}

export async function updatePrivateDeliveryOutlet(
  outletId: string,
  request: DeliveryOutletWriteRequest,
) {
  return run((accessToken) => privateDeliveryOutletsApi.update(outletId, request, accessToken));
}

export async function updatePrivateDeliveryOutletStatus(
  outletId: string,
  status: DeliveryOutletStatus,
) {
  return run((accessToken) =>
    privateDeliveryOutletsApi.updateStatus(outletId, status, accessToken),
  );
}

export async function deletePrivateDeliveryOutlet(outletId: string) {
  return run((accessToken) => privateDeliveryOutletsApi.delete(outletId, accessToken));
}

export async function getPrivateDeliveryOutletStatistics() {
  return run((accessToken) => privateDeliveryOutletsApi.statistics(accessToken));
}

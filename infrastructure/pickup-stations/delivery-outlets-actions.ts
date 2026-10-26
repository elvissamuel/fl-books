"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  DeliveryOutletFilterQuery,
  DeliveryOutletListQuery,
  DeliveryOutletStatus,
  DeliveryOutletWriteRequest,
} from "@/core/pickup-stations/delivery-outlet-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privateDeliveryOutletsApi } from "@/infrastructure/pickup-stations/http-delivery-outlets-api";

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

"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type { DistanceBandWriteRequest } from "@/core/distance-bands/private-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privateDistanceBandsApi } from "@/infrastructure/distance-bands/http-distance-bands-api";

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

export async function listPrivateDistanceBands() {
  return run((accessToken) => privateDistanceBandsApi.list(accessToken));
}

export async function getPrivateDistanceBand(bandId: string) {
  return run((accessToken) => privateDistanceBandsApi.get(bandId, accessToken));
}

export async function createPrivateDistanceBand(request: DistanceBandWriteRequest) {
  return run((accessToken) => privateDistanceBandsApi.create(request, accessToken));
}

export async function updatePrivateDistanceBand(bandId: string, request: DistanceBandWriteRequest) {
  return run((accessToken) => privateDistanceBandsApi.update(bandId, request, accessToken));
}

export async function deletePrivateDistanceBand(bandId: string) {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    const response = await privateDistanceBandsApi.delete(bandId, opened.session.accessToken);
    if (!response.success) {
      return { ok: false as const, message: response.message || "Request failed." };
    }
    return { ok: true as const, data: response.data ?? response.message };
  } catch (error) {
    return adminActionFailure(error);
  }
}

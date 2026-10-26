"use client";

import type { DistanceBandWriteRequest } from "@/core/distance-bands/private-api";
import { browserApi } from "@/infrastructure/http/browser-api";

const list = "/api/v1/distance-bands/private";
const byId = (bandId: string) => `/api/v1/distance-bands/private/${encodeURIComponent(bandId)}`;

export async function listPrivateDistanceBands() {
  return browserApi<import("@/core/distance-bands/private-api").DistanceBand[]>(list);
}

export async function getPrivateDistanceBand(bandId: string) {
  return browserApi<import("@/core/distance-bands/private-api").DistanceBand>(byId(bandId));
}

export async function createPrivateDistanceBand(request: DistanceBandWriteRequest) {
  return browserApi<import("@/core/distance-bands/private-api").DistanceBand>(list, {
    method: "POST",
    json: request,
  });
}

export async function updatePrivateDistanceBand(bandId: string, request: DistanceBandWriteRequest) {
  return browserApi<import("@/core/distance-bands/private-api").DistanceBand>(byId(bandId), {
    method: "PUT",
    json: request,
  });
}

export async function deletePrivateDistanceBand(bandId: string) {
  return browserApi<string>(byId(bandId), { method: "DELETE", allowEmptyData: true });
}

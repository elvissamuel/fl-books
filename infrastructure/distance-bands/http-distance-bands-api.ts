import "server-only";

import type { PrivateDistanceBandsApi } from "@/core/distance-bands/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateDistanceBandEndpoints = {
  list: "/api/v1/distance-bands/private",
  byId: (bandId: string) => `/api/v1/distance-bands/private/${encodeURIComponent(bandId)}`,
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

export const privateDistanceBandsApi: PrivateDistanceBandsApi = {
  list(accessToken) {
    return apiJson(privateDistanceBandEndpoints.list, withAccessToken(accessToken));
  },

  get(bandId, accessToken) {
    return apiJson(privateDistanceBandEndpoints.byId(bandId), withAccessToken(accessToken));
  },

  create(request, accessToken) {
    return apiJson(
      privateDistanceBandEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  update(bandId, request, accessToken) {
    return apiJson(
      privateDistanceBandEndpoints.byId(bandId),
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  delete(bandId, accessToken) {
    return apiJson(
      privateDistanceBandEndpoints.byId(bandId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },
};

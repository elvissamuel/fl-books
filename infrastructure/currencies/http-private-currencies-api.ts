import "server-only";

import type { PrivateCurrenciesApi } from "@/core/currencies/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateCurrencyEndpoints = {
  list: "/api/v1/currencies/private",
  byId: (currencyId: string) => `/api/v1/currencies/private/${encodeURIComponent(currencyId)}`,
  activate: (currencyId: string) =>
    `/api/v1/currencies/private/${encodeURIComponent(currencyId)}/activate`,
  deactivate: (currencyId: string) =>
    `/api/v1/currencies/private/${encodeURIComponent(currencyId)}/deactivate`,
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

export const privateCurrenciesApi: PrivateCurrenciesApi = {
  list(accessToken) {
    return apiJson(privateCurrencyEndpoints.list, withAccessToken(accessToken));
  },

  get(currencyId, accessToken) {
    return apiJson(privateCurrencyEndpoints.byId(currencyId), withAccessToken(accessToken));
  },

  create(request, accessToken) {
    return apiJson(
      privateCurrencyEndpoints.list,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  update(currencyId, request, accessToken) {
    return apiJson(
      privateCurrencyEndpoints.byId(currencyId),
      withAccessToken(accessToken, {
        method: "PATCH",
        body: JSON.stringify(request),
      }),
    );
  },

  delete(currencyId, accessToken) {
    return apiJson(
      privateCurrencyEndpoints.byId(currencyId),
      withAccessToken(accessToken, { method: "DELETE" }),
    );
  },

  activate(currencyId, accessToken) {
    return apiJson(
      privateCurrencyEndpoints.activate(currencyId),
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },

  deactivate(currencyId, accessToken) {
    return apiJson(
      privateCurrencyEndpoints.deactivate(currencyId),
      withAccessToken(accessToken, { method: "PATCH" }),
    );
  },
};

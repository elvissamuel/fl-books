import "server-only";

import type { PublicCurrenciesApi } from "@/core/currencies/public-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const publicCurrencyEndpoints = {
  list: "/api/v1/currencies/public",
  byCode: (currencyCode: string) =>
    `/api/v1/currencies/public/code/${encodeURIComponent(currencyCode)}`,
  convert: "/api/v1/currencies/public/convert",
} as const;

export const publicCurrenciesApi: PublicCurrenciesApi = {
  list() {
    return apiJson(publicCurrencyEndpoints.list);
  },

  getByCode(currencyCode) {
    return apiJson(publicCurrencyEndpoints.byCode(currencyCode));
  },

  convert(request) {
    return apiJson(publicCurrencyEndpoints.convert, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

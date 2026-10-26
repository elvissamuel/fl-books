"use client";

import type { Currency, CurrencyWriteRequest } from "@/core/currencies/currency";
import { browserApi } from "@/infrastructure/http/browser-api";

const list = "/api/v1/currencies/private";
const byId = (currencyId: string) => `/api/v1/currencies/private/${encodeURIComponent(currencyId)}`;

export async function listPrivateCurrencies() {
  return browserApi<Currency[]>(list);
}

export async function getPrivateCurrency(currencyId: string) {
  return browserApi<Currency>(byId(currencyId));
}

export async function createPrivateCurrency(request: CurrencyWriteRequest) {
  return browserApi<Currency>(list, { method: "POST", json: request });
}

export async function updatePrivateCurrency(currencyId: string, request: CurrencyWriteRequest) {
  return browserApi<Currency>(byId(currencyId), { method: "PATCH", json: request });
}

export async function deletePrivateCurrency(currencyId: string) {
  return browserApi<string>(byId(currencyId), { method: "DELETE", allowEmptyData: true });
}

export async function activatePrivateCurrency(currencyId: string) {
  return browserApi<Currency>(`${byId(currencyId)}/activate`, { method: "PATCH" });
}

export async function deactivatePrivateCurrency(currencyId: string) {
  return browserApi<Currency>(`${byId(currencyId)}/deactivate`, { method: "PATCH" });
}

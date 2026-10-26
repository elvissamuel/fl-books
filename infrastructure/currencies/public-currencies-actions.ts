"use client";

import type {
  Currency,
  CurrencyConversion,
  CurrencyConversionRequest,
} from "@/core/currencies/currency";
import { browserApi } from "@/infrastructure/http/browser-api";

export async function listPublicCurrencies() {
  return browserApi<Currency[]>("/api/v1/currencies/public");
}

export async function getPublicCurrencyByCode(currencyCode: string) {
  return browserApi<Currency>(`/api/v1/currencies/public/code/${encodeURIComponent(currencyCode)}`);
}

export async function convertPublicCurrency(request: CurrencyConversionRequest) {
  return browserApi<CurrencyConversion>("/api/v1/currencies/public/convert", {
    method: "POST",
    json: request,
  });
}

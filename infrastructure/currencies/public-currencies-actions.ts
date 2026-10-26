"use server";

import { unstable_rethrow } from "next/navigation";
import type { ApiResponse } from "@/core/auth/admin-api";
import type { CurrencyConversionRequest } from "@/core/currencies/currency";
import { publicCurrenciesApi } from "@/infrastructure/currencies/http-public-currencies-api";
import { ApiError } from "@/infrastructure/http/api-client";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

async function run<T>(task: () => Promise<ApiResponse<T>>): Promise<ActionResult<T>> {
  try {
    const response = await task();
    if (!response.success || response.data == null) {
      return { ok: false, message: response.message || "Request failed." };
    }
    return { ok: true, data: response.data };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "Request failed." };
  }
}

export async function listPublicCurrencies() {
  return run(() => publicCurrenciesApi.list());
}

export async function getPublicCurrencyByCode(currencyCode: string) {
  return run(() => publicCurrenciesApi.getByCode(currencyCode));
}

export async function convertPublicCurrency(request: CurrencyConversionRequest) {
  return run(() => publicCurrenciesApi.convert(request));
}

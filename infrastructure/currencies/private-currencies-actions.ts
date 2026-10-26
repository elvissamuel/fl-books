"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type { CurrencyWriteRequest } from "@/core/currencies/currency";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privateCurrenciesApi } from "@/infrastructure/currencies/http-private-currencies-api";

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

export async function listPrivateCurrencies() {
  return run((accessToken) => privateCurrenciesApi.list(accessToken));
}

export async function getPrivateCurrency(currencyId: string) {
  return run((accessToken) => privateCurrenciesApi.get(currencyId, accessToken));
}

export async function createPrivateCurrency(request: CurrencyWriteRequest) {
  return run((accessToken) => privateCurrenciesApi.create(request, accessToken));
}

export async function updatePrivateCurrency(currencyId: string, request: CurrencyWriteRequest) {
  return run((accessToken) => privateCurrenciesApi.update(currencyId, request, accessToken));
}

export async function deletePrivateCurrency(currencyId: string) {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    const response = await privateCurrenciesApi.delete(currencyId, opened.session.accessToken);
    if (!response.success) {
      return { ok: false as const, message: response.message || "Request failed." };
    }
    return { ok: true as const, data: response.data ?? response.message };
  } catch (error) {
    return adminActionFailure(error);
  }
}

export async function activatePrivateCurrency(currencyId: string) {
  return run((accessToken) => privateCurrenciesApi.activate(currencyId, accessToken));
}

export async function deactivatePrivateCurrency(currencyId: string) {
  return run((accessToken) => privateCurrenciesApi.deactivate(currencyId, accessToken));
}

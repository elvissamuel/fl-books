"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { CurrencyConversionRequest } from "@/core/currencies/currency";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { currencyKeys } from "@/features/currencies/query-keys";
import {
  convertPublicCurrency,
  getPublicCurrencyByCode,
  listPublicCurrencies,
} from "@/infrastructure/currencies/public-currencies-actions";

export function usePublicCurrencies() {
  return useQuery({
    queryKey: currencyKeys.publicList(),
    queryFn: async () => unwrapAction(await listPublicCurrencies()),
  });
}

export function usePublicCurrency(currencyCode: string) {
  return useQuery({
    queryKey: currencyKeys.publicByCode(currencyCode),
    queryFn: async () => unwrapAction(await getPublicCurrencyByCode(currencyCode)),
    enabled: currencyCode.length > 0,
  });
}

export function useConvertPublicCurrency() {
  return useMutation({
    mutationFn: async (request: CurrencyConversionRequest) =>
      unwrapAction(await convertPublicCurrency(request)),
  });
}

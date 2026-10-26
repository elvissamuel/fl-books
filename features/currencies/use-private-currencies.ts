"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CurrencyWriteRequest } from "@/core/currencies/currency";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { currencyKeys } from "@/features/currencies/query-keys";
import {
  activatePrivateCurrency,
  createPrivateCurrency,
  deactivatePrivateCurrency,
  deletePrivateCurrency,
  getPrivateCurrency,
  listPrivateCurrencies,
  updatePrivateCurrency,
} from "@/infrastructure/currencies/private-currencies-actions";

function useRefreshCurrencies() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: currencyKeys.all });
}

export function usePrivateCurrencies() {
  return useQuery({
    queryKey: currencyKeys.privateList(),
    queryFn: async () => unwrapAction(await listPrivateCurrencies()),
  });
}

export function usePrivateCurrency(currencyId: string) {
  return useQuery({
    queryKey: currencyKeys.privateDetail(currencyId),
    queryFn: async () => unwrapAction(await getPrivateCurrency(currencyId)),
    enabled: currencyId.length > 0,
  });
}

export function useCreatePrivateCurrency() {
  const refresh = useRefreshCurrencies();
  return useMutation({
    mutationFn: async (request: CurrencyWriteRequest) =>
      unwrapAction(await createPrivateCurrency(request)),
    onSuccess: refresh,
  });
}

export function useUpdatePrivateCurrency() {
  const refresh = useRefreshCurrencies();
  return useMutation({
    mutationFn: async ({
      currencyId,
      request,
    }: {
      currencyId: string;
      request: CurrencyWriteRequest;
    }) => unwrapAction(await updatePrivateCurrency(currencyId, request)),
    onSuccess: refresh,
  });
}

export function useDeletePrivateCurrency() {
  const refresh = useRefreshCurrencies();
  return useMutation({
    mutationFn: async (currencyId: string) => unwrapAction(await deletePrivateCurrency(currencyId)),
    onSuccess: refresh,
  });
}

export function useActivatePrivateCurrency() {
  const refresh = useRefreshCurrencies();
  return useMutation({
    mutationFn: async (currencyId: string) =>
      unwrapAction(await activatePrivateCurrency(currencyId)),
    onSuccess: refresh,
  });
}

export function useDeactivatePrivateCurrency() {
  const refresh = useRefreshCurrencies();
  return useMutation({
    mutationFn: async (currencyId: string) =>
      unwrapAction(await deactivatePrivateCurrency(currencyId)),
    onSuccess: refresh,
  });
}

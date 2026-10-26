"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminProfile,
  DistanceTierInput,
  StoreCurrencyInput,
  WeightSurcharge,
} from "@/core/platform-settings/types";
import { platformSettingsKeys } from "@/features/platform-settings/query-keys";
import { platformSettingsApi } from "@/infrastructure/platform-settings/platform-settings-api";

export function usePlatformSettings() {
  return useQuery({
    queryKey: platformSettingsKeys.all,
    queryFn: () => platformSettingsApi.get(),
  });
}

function useRefreshSettings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: platformSettingsKeys.all });
}

export function useUpdateAdminProfile() {
  const refresh = useRefreshSettings();
  return useMutation({
    mutationFn: (profile: AdminProfile) => platformSettingsApi.updateProfile(profile),
    onSuccess: refresh,
  });
}

export function useUpdateWeightSurcharge() {
  const refresh = useRefreshSettings();
  return useMutation({
    mutationFn: (weight: WeightSurcharge) => platformSettingsApi.updateWeight(weight),
    onSuccess: refresh,
  });
}

export function useSaveDistanceTier() {
  const refresh = useRefreshSettings();
  return useMutation({
    mutationFn: (input: DistanceTierInput) => platformSettingsApi.saveTier(input),
    onSuccess: refresh,
  });
}

export function useDeleteDistanceTier() {
  const refresh = useRefreshSettings();
  return useMutation({
    mutationFn: (tierId: string) => platformSettingsApi.deleteTier(tierId),
    onSuccess: refresh,
  });
}

export function useSaveStoreCurrency() {
  const refresh = useRefreshSettings();
  return useMutation({
    mutationFn: (input: StoreCurrencyInput) => platformSettingsApi.saveCurrency(input),
    onSuccess: refresh,
  });
}

export function useDeleteStoreCurrency() {
  const refresh = useRefreshSettings();
  return useMutation({
    mutationFn: (currencyId: string) => platformSettingsApi.deleteCurrency(currencyId),
    onSuccess: refresh,
  });
}

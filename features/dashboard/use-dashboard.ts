"use client";

import { useQuery } from "@tanstack/react-query";
import type { RevenuePeriod } from "@/core/dashboard/types";
import {
  dashboardApi,
  dashboardFixtures,
} from "@/infrastructure/dashboard/dashboard-api";
import { dashboardKeys } from "@/features/dashboard/query-keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
    placeholderData: dashboardFixtures.stats,
  });
}

export function useRevenueTrend(period: RevenuePeriod) {
  return useQuery({
    queryKey: dashboardKeys.revenue(period),
    queryFn: () => dashboardApi.getRevenueTrend(period),
    placeholderData: dashboardFixtures.revenue[period],
  });
}

export function useFulfillment() {
  return useQuery({
    queryKey: dashboardKeys.fulfillment(),
    queryFn: () => dashboardApi.getFulfillment(),
    placeholderData: dashboardFixtures.fulfillment,
  });
}

export function useShippingCountries() {
  return useQuery({
    queryKey: dashboardKeys.shipping(),
    queryFn: () => dashboardApi.getShippingCountries(),
    placeholderData: dashboardFixtures.shipping,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(),
    queryFn: () => dashboardApi.getRecentOrders(),
    placeholderData: dashboardFixtures.recentOrders,
  });
}

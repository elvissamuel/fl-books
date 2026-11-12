"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardOverviewFilter } from "@/core/dashboard/private-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import { getPrivateDashboardOverview } from "@/infrastructure/dashboard/dashboard-actions";

export function usePrivateDashboardOverview(filter: DashboardOverviewFilter) {
  return useQuery({
    queryKey: dashboardKeys.overview(filter),
    queryFn: async () => unwrapAction(await getPrivateDashboardOverview(filter)),
  });
}

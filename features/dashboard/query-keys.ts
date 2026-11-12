import type { DashboardOverviewFilter } from "@/core/dashboard/private-api";
import type { RevenuePeriod } from "@/core/dashboard/types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (filter: DashboardOverviewFilter) => [...dashboardKeys.all, "overview", filter] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenue: (period: RevenuePeriod) =>
    [...dashboardKeys.all, "revenue", period] as const,
  fulfillment: () => [...dashboardKeys.all, "fulfillment"] as const,
  shipping: () => [...dashboardKeys.all, "shipping"] as const,
  recentOrders: () => [...dashboardKeys.all, "recent-orders"] as const,
};

"use client";

import { useState } from "react";
import { FulfillmentCard } from "@/components/dashboard/fulfillment-card";
import { RecentOrdersCard } from "@/components/dashboard/recent-orders-card";
import { RevenueTrendCard } from "@/components/dashboard/revenue-trend-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TopCountriesCard } from "@/components/dashboard/top-countries-card";
import type { DashboardOverviewFilter } from "@/core/dashboard/private-api";
import {
  dashboardCountries,
  dashboardFulfilment,
  dashboardRecentOrders,
  dashboardRevenue,
  dashboardStats,
} from "@/core/dashboard/map-overview";
import type { RevenuePeriod } from "@/core/dashboard/types";
import { usePrivateDashboardOverview } from "@/features/dashboard/use-dashboard";

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function overviewFilter(period: RevenuePeriod): DashboardOverviewFilter {
  const to = new Date();
  const from = new Date(to);
  if (period === "weekly") from.setDate(to.getDate() - 49);
  else from.setMonth(to.getMonth() - 11);

  return {
    from: isoDate(from),
    to: isoDate(to),
    grouping: "WEEKLY",
    recentLimit: 8,
    countryLimit: 4,
  };
}

export function DashboardOverview() {
  const [period, setPeriod] = useState<RevenuePeriod>("weekly");
  const overview = usePrivateDashboardOverview(overviewFilter(period));
  const data = overview.data;

  if (overview.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
        <span className="sr-only">Loading dashboard</span>
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-neutral-200/80" />
        ))}
      </div>
    );
  }

  if (overview.error instanceof Error) {
    return <p className="text-sm text-danger">{overview.error.message}</p>;
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <StatsGrid stats={dashboardStats(data)} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.86fr)]">
        <RevenueTrendCard period={period} trend={dashboardRevenue(data)} onPeriodChange={setPeriod} />
        <div className="flex flex-col gap-4">
          <FulfillmentCard slices={dashboardFulfilment(data)} />
          <TopCountriesCard summary={dashboardCountries(data)} />
        </div>
      </div>
      <RecentOrdersCard orders={dashboardRecentOrders(data)} />
    </div>
  );
}

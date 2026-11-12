"use client";

import type { DashboardOverview, DashboardOverviewFilter } from "@/core/dashboard/private-api";
import { browserApi, withSearch } from "@/infrastructure/http/browser-api";

const overview = "/api/v1/dashboard/private";

function overviewSearch(filter: DashboardOverviewFilter) {
  return new URLSearchParams({
    from: filter.from,
    to: filter.to,
    grouping: filter.grouping,
    recentLimit: String(filter.recentLimit),
    countryLimit: String(filter.countryLimit),
  });
}

export async function getPrivateDashboardOverview(filter: DashboardOverviewFilter) {
  return browserApi<DashboardOverview>(withSearch(overview, overviewSearch(filter)));
}

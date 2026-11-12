import "server-only";

import type { DashboardOverviewFilter, PrivateDashboardApi } from "@/core/dashboard/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privateDashboardEndpoints = {
  overview: "/api/v1/dashboard/private",
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function overviewSearch(filter: DashboardOverviewFilter) {
  return new URLSearchParams({
    from: filter.from,
    to: filter.to,
    grouping: filter.grouping,
    recentLimit: String(filter.recentLimit),
    countryLimit: String(filter.countryLimit),
  });
}

export const privateDashboardApi: PrivateDashboardApi = {
  overview(filter, accessToken) {
    const search = overviewSearch(filter);
    return apiJson(
      `${privateDashboardEndpoints.overview}?${search.toString()}`,
      withAccessToken(accessToken),
    );
  },
};

import type { DashboardStat } from "@/core/dashboard/types";

export function formatStatValue(stat: DashboardStat) {
  const formatted = stat.value.toLocaleString("en-US");
  if (stat.currency === "USD") return `$${formatted}`;
  if (stat.currency === "NGN") return `₦${formatted}`;
  return formatted;
}

export function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-US")}`;
}

export function formatTrend(percent: number) {
  return `${percent}% vs previous period`;
}

export function formatThousands(value: number) {
  return `${Math.round(value / 1000)}k`;
}

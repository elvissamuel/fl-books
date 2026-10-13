"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboardStats } from "@/features/dashboard/use-dashboard";

export function StatsGrid() {
  const { data } = useDashboardStats();

  if (!data) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </section>
  );
}

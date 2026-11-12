"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import type { DashboardStat } from "@/core/dashboard/types";

export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </section>
  );
}

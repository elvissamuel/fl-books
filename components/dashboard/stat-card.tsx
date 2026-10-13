import { Card, CardContent } from "@/components/ui/card";
import { formatStatValue, formatTrend } from "@/core/dashboard/format";
import type { DashboardStat } from "@/core/dashboard/types";

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <Card size="sm" className="shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <CardContent className="flex flex-col gap-1.5">
        <p className="text-[13px] text-neutral-500">{stat.label}</p>
        <p className="text-[1.65rem] leading-none font-semibold tracking-tight text-neutral-950 tabular-nums">
          {formatStatValue(stat)}
        </p>
        <p className="text-xs font-medium text-[#1f9d55]">
          {formatTrend(stat.trendPercent)}
        </p>
      </CardContent>
    </Card>
  );
}

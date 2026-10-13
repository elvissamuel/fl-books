"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatNaira, formatThousands } from "@/core/dashboard/format";
import type { RevenuePeriod } from "@/core/dashboard/types";
import { useRevenueTrend } from "@/features/dashboard/use-dashboard";
import { cn } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3caf6e",
  },
} satisfies ChartConfig;

const periods: { id: RevenuePeriod; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

export function RevenueTrendCard() {
  const [period, setPeriod] = useState<RevenuePeriod>("monthly");
  const { data } = useRevenueTrend(period);
  const highlight = data?.points.find((point) => point.highlighted);

  return (
    <Card className="h-full gap-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <CardHeader className="items-center">
        <CardTitle className="text-[15px] font-semibold text-neutral-900">
          Revenue trend
        </CardTitle>
        <CardAction>
          <div className="flex rounded-lg bg-neutral-100 p-0.5" role="group" aria-label="Revenue period">
            {periods.map((option) => {
              const selected = option.id === period;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPeriod(option.id)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium",
                    selected
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        {data ? (
          <ChartContainer
            config={chartConfig}
            initialDimension={{ width: 640, height: 260 }}
            className="aspect-auto h-[268px] w-full"
          >
            <LineChart data={data.points} margin={{ top: 46, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#ececec" strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={42}
                domain={[12000, 108000]}
                ticks={[20000, 40000, 60000, 80000, 100000]}
                tickFormatter={formatThousands}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              {highlight ? (
                <ReferenceLine
                  segment={[
                    { x: highlight.label, y: highlight.revenue },
                    { x: highlight.label, y: 12000 },
                  ]}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              ) : null}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              {highlight ? (
                <ReferenceDot
                  x={highlight.label}
                  y={highlight.revenue}
                  r={5}
                  fill="#ffffff"
                  stroke="#3caf6e"
                  strokeWidth={2}
                  label={(props: { viewBox?: { x?: number; y?: number } }) => (
                    <PeakCallout
                      viewBox={props.viewBox}
                      value={formatNaira(highlight.revenue)}
                      caption={highlight.tooltipLabel ?? highlight.label}
                    />
                  )}
                />
              ) : null}
            </LineChart>
          </ChartContainer>
        ) : null}
      </CardContent>
    </Card>
  );
}

function PeakCallout({
  viewBox,
  value,
  caption,
}: {
  viewBox?: { x?: number; y?: number };
  value: string;
  caption: string;
}) {
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;
  const width = 84;
  const height = 36;

  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - height - 14}
        width={width}
        height={height}
        rx={6}
        fill="#ffffff"
        stroke="#ececec"
      />
      <text
        x={x}
        y={y - height}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="#171717"
      >
        {value}
      </text>
      <text x={x} y={y - 18} textAnchor="middle" fontSize={10} fill="#737373">
        {caption}
      </text>
    </g>
  );
}

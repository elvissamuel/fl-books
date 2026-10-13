"use client";

import { Store, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FulfillmentSlice } from "@/core/dashboard/types";
import { useFulfillment } from "@/features/dashboard/use-dashboard";

const tones = {
  delivery: "bg-[#f5a524]",
  pickup: "bg-[#3caf6e]",
} as const;

export function FulfillmentCard() {
  const { data } = useFulfillment();

  return (
    <Card className="gap-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <CardHeader>
        <CardTitle className="text-[15px] font-semibold text-neutral-900">
          Fulfillment
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data?.map((slice) => (
          <FulfillmentRow key={slice.id} slice={slice} />
        ))}
      </CardContent>
    </Card>
  );
}

function FulfillmentRow({ slice }: { slice: FulfillmentSlice }) {
  const Icon = slice.id === "delivery" ? Truck : Store;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-[13px]">
        <span className="flex items-center gap-2 text-neutral-700">
          <Icon className="size-4 text-neutral-500" strokeWidth={1.75} />
          {slice.label}
        </span>
        <span className="font-medium text-neutral-800 tabular-nums">{slice.percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${tones[slice.id]}`}
          style={{ width: `${slice.percent}%` }}
        />
      </div>
    </div>
  );
}

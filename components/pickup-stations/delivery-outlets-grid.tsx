"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/core/dashboard/format";
import type { DeliveryOutletStatus, PrivateDeliveryOutlet } from "@/core/pickup-stations/delivery-outlet-api";
import { cn } from "@/lib/utils";

const statusStyles: Record<DeliveryOutletStatus, string> = {
  ACTIVE: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  INACTIVE: "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
};

export function DeliveryOutletsGrid({
  outlets,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: {
  outlets: PrivateDeliveryOutlet[];
  onEdit: (outlet: PrivateDeliveryOutlet) => void;
  onActivate: (outlet: PrivateDeliveryOutlet) => void;
  onDeactivate: (outlet: PrivateDeliveryOutlet) => void;
  onDelete: (outlet: PrivateDeliveryOutlet) => void;
}) {
  if (outlets.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white px-4 py-12 text-center text-sm text-neutral-500">
        No locations found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {outlets.map((outlet) => (
        <article
          key={outlet.id}
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-neutral-400">Action:</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-medium text-neutral-600"
                onClick={() =>
                  outlet.status === "ACTIVE" ? onDeactivate(outlet) : onActivate(outlet)
                }
              >
                {outlet.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                className="text-neutral-700"
                aria-label={`Edit ${outlet.outletName}`}
                onClick={() => onEdit(outlet)}
              >
                <Pencil className="size-3.5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="text-[#e35d6a]"
                aria-label={`Delete ${outlet.outletName}`}
                onClick={() => onDelete(outlet)}
              >
                <Trash2 className="size-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <h2 className="max-w-[16rem] text-[15px] leading-snug font-semibold tracking-tight text-neutral-950">
            {outlet.outletName}
          </h2>

          <div className="mt-3 rounded-lg border border-neutral-200 px-3 py-2.5">
            <p className="text-[11px] text-neutral-400">Full Address</p>
            <p className="mt-0.5 text-[13px] font-medium text-neutral-800">{outlet.fullAddress}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Field label="City" value={outlet.city} />
              <Field label="State" value={outlet.state} />
              <Field label="Country" value={outlet.country} />
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-neutral-200 px-3 py-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Contact Name" value={outlet.contactName} />
              <Field label="Phone No." value={outlet.phoneNumber} />
            </div>
            <div className="mt-3 grid grid-cols-2 items-start gap-2">
              <Field label="Email" value={outlet.emailAddress} />
              <div>
                <p className="text-[11px] text-neutral-400">Status</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1 h-5 rounded-full px-2 text-[11px] font-medium",
                    statusStyles[outlet.status],
                  )}
                >
                  {outlet.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-neutral-800">
              Configured Weight Price Brackets ({outlet.weightPrices.length})
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {outlet.weightPrices.map((bracket, index) => (
                <div
                  key={`${bracket.minKg}-${bracket.maxKg}-${index}`}
                  className="rounded-md border border-neutral-200 px-1.5 py-1.5"
                >
                  <p className="text-[10px] text-neutral-400">
                    {bracket.minKg}kg–{bracket.maxKg}kg
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-neutral-900">
                    {formatNaira(bracket.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-neutral-400">{label}</p>
      <p className="mt-0.5 text-[13px] leading-snug font-medium break-words text-neutral-800">{value}</p>
    </div>
  );
}

"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { NumberStepper, formatStepperValue } from "@/components/platform-settings/number-stepper";
import { Button } from "@/components/ui/button";
import type { DistanceBand } from "@/core/distance-bands/private-api";
import { formatNaira } from "@/core/dashboard/format";
import type { WeightSurcharge } from "@/core/platform-settings/types";

export function DistancePricingPanel({
  tiers,
  loading,
  weight,
  onWeightChange,
  onAdd,
  onEdit,
  onDelete,
}: {
  tiers: DistanceBand[];
  loading: boolean;
  weight: WeightSurcharge;
  onWeightChange: (weight: WeightSurcharge) => void;
  onAdd: () => void;
  onEdit: (tier: DistanceBand) => void;
  onDelete: (tier: DistanceBand) => void;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-neutral-200 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-neutral-950">
              Distance & Weight Freight Computation Engine
            </h2>
            <p className="mt-0.5 text-xs text-neutral-400">Choose how delivery pricing is structured.</p>
          </div>
          <Button type="button" onClick={onAdd} className="h-9 shrink-0 rounded-lg px-3 text-xs">
            <Plus className="size-3.5" />
            Add distance band
          </Button>
        </div>
        <div className="mt-4 space-y-2.5">
          {loading ? (
            <div role="status" className="flex justify-center py-10">
              <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
              <span className="sr-only">Loading distance bands</span>
            </div>
          ) : null}
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-950">{tier.label}</p>
                <p className="text-xs text-neutral-400">Transit: {tier.estimatedTransit}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <p className="text-sm font-semibold text-neutral-950">{formatNaira(tier.fee)}</p>
                <button
                  type="button"
                  aria-label={`Edit ${tier.label}`}
                  onClick={() => onEdit(tier)}
                  className="text-neutral-500"
                >
                  <Pencil className="size-3.5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${tier.label}`}
                  onClick={() => onDelete(tier)}
                  className="text-[#e35d6a]"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 px-4 py-4">
        <h2 className="text-[15px] font-semibold text-neutral-950">Package Weight Surcharge Rules</h2>
        <p className="mt-0.5 text-xs text-neutral-400">
          How book weight interacts with distance to calculate total shipping fee.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-neutral-900">
              Base Weight Allowance (kg included free)
              <span className="text-[#e11d48]">*</span>
            </span>
            <input
              inputMode="decimal"
              value={String(weight.baseKg)}
              onChange={(event) => {
                const next = Number.parseFloat(event.target.value);
                onWeightChange({
                  ...weight,
                  baseKg: Number.isFinite(next) ? Math.max(0, next) : 0,
                });
              }}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <span className="mt-1.5 block text-[11px] text-neutral-400">
              Orders up to this weight incur $0 excess surcharge.
            </span>
          </label>
          <div>
            <span className="mb-1.5 block text-[13px] font-medium text-neutral-900">
              Rate Per Additional kg (NGN/kg)
              <span className="text-[#e11d48]">*</span>
            </span>
            <NumberStepper
              label="Rate Per Additional kg"
              value={formatStepperValue(weight.ratePerKg)}
              step={1}
              onChange={(value) => {
                const next = Number.parseFloat(value.replace(/,/g, ""));
                onWeightChange({
                  ...weight,
                  ratePerKg: Number.isFinite(next) ? Math.max(0, next) : 0,
                });
              }}
            />
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Added per kg beyond base allowance: (Weight – Base) x Rate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

export function formatStepperValue(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseStepperValue(value: string) {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join("").slice(0, 2)}`;
}

export function NumberStepper({
  label,
  value,
  onChange,
  step = 0.01,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: number;
}) {
  function changeBy(delta: number) {
    const current = Number.parseFloat(value.replace(/,/g, ""));
    const base = Number.isFinite(current) ? current : 0;
    onChange(formatStepperValue(Math.max(0, Math.round((base + delta) * 100) / 100)));
  }

  return (
    <div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-white pr-1 pl-3">
      <input
        aria-label={label}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(parseStepperValue(event.target.value))}
        onBlur={() => {
          const current = Number.parseFloat(value.replace(/,/g, ""));
          onChange(formatStepperValue(Number.isFinite(current) ? Math.max(0, current) : 0));
        }}
        className="w-full min-w-0 bg-transparent text-sm text-neutral-800 outline-none"
      />
      <div className="flex shrink-0 flex-col text-neutral-700">
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => changeBy(step)}
          className="flex h-4 items-center justify-center px-0.5"
        >
          <ChevronUp className="size-3" strokeWidth={2.25} />
        </button>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => changeBy(-step)}
          className="flex h-4 items-center justify-center px-0.5"
        >
          <ChevronDown className="size-3" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { NumberStepper, formatStepperValue } from "@/components/platform-settings/number-stepper";
import type { DistanceBand, DistanceBandWriteRequest } from "@/core/distance-bands/private-api";

const controlClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function DistanceTierDialog({
  tier,
  pending,
  onClose,
  onSave,
}: {
  tier?: DistanceBand;
  pending: boolean;
  onClose: () => void;
  onSave: (input: DistanceBandWriteRequest) => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const [label, setLabel] = useState(tier?.label ?? "");
  const [minKm, setMinKm] = useState(formatStepperValue(tier?.minKm ?? 0));
  const [maxKm, setMaxKm] = useState(formatStepperValue(tier?.maxKm ?? 0));
  const [fee, setFee] = useState(formatStepperValue(tier?.fee ?? 0));
  const [transit, setTransit] = useState(tier?.estimatedTransit ?? "");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pending]);

  function saveTier() {
    if (!label.trim() || !transit.trim()) {
      setFormError("Tier label and estimated transit are required.");
      return;
    }
    setFormError("");
    onSave({
      label: label.trim(),
      minKm: Number.parseFloat(minKm.replace(/,/g, "")) || 0,
      maxKm: Number.parseFloat(maxKm.replace(/,/g, "")) || 0,
      fee: Number.parseFloat(fee.replace(/,/g, "")) || 0,
      estimatedTransit: transit.trim(),
    });
  }

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/25"
        aria-label="Close distance tier"
        onClick={() => {
          if (!pending) onClose();
        }}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-[520px] rounded-2xl bg-white px-6 pt-5 pb-6 shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-base font-semibold text-neutral-950">
            {tier ? "Edit tier label" : "Add tier label"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="text-neutral-700"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            saveTier();
          }}
        >
          {formError ? <p className="text-sm text-danger">{formError}</p> : null}
          <ModalField id="tier-label" label="Tier Label">
            <input
              id="tier-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Type here"
              className={controlClass}
            />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField id="tier-min" label="Min Km">
              <NumberStepper label="Min Km" value={minKm} onChange={setMinKm} />
            </ModalField>
            <ModalField id="tier-max" label="Max Km">
              <NumberStepper label="Max Km" value={maxKm} onChange={setMaxKm} />
            </ModalField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModalField id="tier-fee" label="Fee (NGN Base)">
              <NumberStepper label="Fee (NGN Base)" value={fee} onChange={setFee} step={1} />
            </ModalField>
            <ModalField id="tier-transit" label="Est. Transit">
              <input
                id="tier-transit"
                value={transit}
                onChange={(event) => setTransit(event.target.value)}
                placeholder="E.g 5-7 working days"
                className={controlClass}
              />
            </ModalField>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="h-11 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save Distance Tier"}
          </button>
        </form>
      </section>
    </div>
  );
}

function ModalField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-neutral-900">
        {label}
        <span className="text-[#e11d48]">*</span>
      </label>
      {children}
    </div>
  );
}

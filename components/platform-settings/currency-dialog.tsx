"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { NumberStepper, formatStepperValue } from "@/components/platform-settings/number-stepper";
import type { Currency, CurrencyWriteRequest } from "@/core/currencies/currency";

const controlClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function CurrencyDialog({
  currency,
  pending,
  onClose,
  onSave,
}: {
  currency?: Currency;
  pending: boolean;
  onClose: () => void;
  onSave: (input: CurrencyWriteRequest) => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const [name, setName] = useState(currency?.currencyName ?? "");
  const [code, setCode] = useState(currency?.currencyCode ?? "");
  const [rate, setRate] = useState(formatStepperValue(currency?.exchangeRate ?? 0));
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pending]);

  function saveCurrency() {
    const currencyName = name.trim();
    const currencyCode = code.trim();
    const exchangeRate = Number.parseFloat(rate.replace(/,/g, ""));
    if (!currencyName || !currencyCode || !Number.isFinite(exchangeRate)) {
      setFormError("Enter the currency name, code, and conversion rate.");
      return;
    }
    setFormError("");
    onSave({
      currencyCode,
      currencyName,
      exchangeRate,
      active: currency?.active ?? true,
    });
  }

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/25"
        aria-label="Close currency"
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
            {currency ? "Edit currency" : "Add currency"}
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
            saveCurrency();
          }}
        >
          {formError ? <p className="text-sm text-danger">{formError}</p> : null}
          <div>
            <label htmlFor="currency-name" className="mb-1.5 block text-[13px] font-medium text-neutral-900">
              Currency name
              <span className="text-[#e11d48]">*</span>
            </label>
            <input
              id="currency-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter currency name"
              className={controlClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="currency-code" className="mb-1.5 block text-[13px] font-medium text-neutral-900">
                Currency code
                <span className="text-[#e11d48]">*</span>
              </label>
              <input
                id="currency-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter currency code"
                className={controlClass}
              />
            </div>
            <div>
              <span className="mb-1.5 block text-[13px] font-medium text-neutral-900">
                Conversion Rate
                <span className="text-[#e11d48]">*</span>
              </span>
              <NumberStepper label="Conversion Rate" value={rate} onChange={setRate} step={1} />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="h-11 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : currency ? "Save Currency" : "Add Currency"}
          </button>
        </form>
      </section>
    </div>
  );
}

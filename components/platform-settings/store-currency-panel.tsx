"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Currency } from "@/core/currencies/currency";

function formatRate(currency: Currency) {
  const rate = Number.isInteger(currency.exchangeRate)
    ? String(currency.exchangeRate)
    : currency.exchangeRate.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return `${rate} NGN = 1 ${currency.currencyCode}`;
}

export function StoreCurrencyPanel({
  currencies,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: {
  currencies: Currency[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (currency: Currency) => void;
  onDelete: (currency: Currency) => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-950">Store Currency</h2>
          <p className="mt-0.5 max-w-xl text-xs text-neutral-400">
            Lorem ipsum dolor sit amet consectetur. Mi a mattis enim parturient ullamcorper.
          </p>
        </div>
        <Button type="button" onClick={onAdd} className="h-9 shrink-0 rounded-lg px-3 text-xs">
          <Plus className="size-3.5" />
          Add Currency
        </Button>
      </div>
      <div className="mt-4 space-y-2.5">
        {loading ? (
          <div role="status" className="flex justify-center py-10">
            <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
            <span className="sr-only">Loading currencies</span>
          </div>
        ) : null}
        {currencies.map((currency) => (
          <article
            key={currency.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-[#fbfbfb] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-950">{currency.currencyName}</p>
              <p className="text-xs text-neutral-400">{formatRate(currency)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                aria-label={`Edit ${currency.currencyName}`}
                onClick={() => onEdit(currency)}
                className="text-neutral-500"
              >
                <Pencil className="size-3.5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label={`Delete ${currency.currencyName}`}
                onClick={() => onDelete(currency)}
                className="text-[#e35d6a]"
              >
                <Trash2 className="size-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Button } from "@/components/ui/button";
import { formatWeightFromGrams } from "@/core/books/format";
import type { BookStockCount, BookStockSummary } from "@/core/books/stock-api";
import { formatNaira } from "@/core/dashboard/format";
import { useAddPrivateBookStock, usePrivateBookStockSummary } from "@/features/book-stock/use-book-stock";

function StockPanel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20"
        aria-label="Close"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-3 right-3 flex w-[min(100%-1.5rem,520px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.16)] outline-none"
      >
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-neutral-950"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back
          </button>
          <h2 id={titleId} className="mt-4 text-lg font-semibold tracking-tight text-neutral-950">
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-5">{children}</div>
      </section>
    </div>
  );
}

function count(value: number) {
  return value.toLocaleString("en-US");
}

const summaryRows: { key: keyof BookStockSummary; label: string }[] = [
  { key: "openingAndInitialStock", label: "Opening and initial stock" },
  { key: "totalRestocked", label: "Total restocked" },
  { key: "totalPurchased", label: "Total purchased" },
  { key: "totalReturned", label: "Total returned" },
  { key: "totalAdjustmentsIn", label: "Adjustments in" },
  { key: "totalAdjustmentsOut", label: "Adjustments out" },
  { key: "currentAvailableStock", label: "Current available stock" },
];

export function AddStockPanel({ book, onClose }: { book: BookStockCount; onClose: () => void }) {
  const addStock = useAddPrivateBookStock();
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit() {
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount < 1) {
      setNotice("");
      setError("Enter a quantity of at least 1.");
      return;
    }
    if (!reason.trim()) {
      setNotice("");
      setError("Enter a reason.");
      return;
    }

    setError("");
    setNotice("");
    try {
      const summary = await addStock.mutateAsync({
        bookId: book.id,
        request: { quantity: amount, reason: reason.trim() },
      });
      setReason("");
      setQuantity("1");
      setNotice(`Stock added. Current available stock is ${count(summary.currentAvailableStock)}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not add stock.");
    }
  }

  return (
    <StockPanel title="Add stock" onClose={onClose}>
      <div className="flex items-center gap-3">
        <BookCover src={book.coverImageUrls[0] ?? null} title={book.title} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-900">{book.title}</p>
          <p className="text-xs text-neutral-500">
            Current stock {count(book.stockQuantity)}
          </p>
        </div>
      </div>

      <label className="mt-5 block text-sm font-medium text-neutral-900" htmlFor="stock-quantity">
        Quantity
      </label>
      <input
        id="stock-quantity"
        inputMode="numeric"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value.replace(/[^\d]/g, ""))}
        className="mt-1.5 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
      />

      <label className="mt-4 block text-sm font-medium text-neutral-900" htmlFor="stock-reason">
        Reason
      </label>
      <textarea
        id="stock-reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Enter a reason"
        rows={4}
        className="mt-1.5 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
      />

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      {notice ? <p className="mt-3 text-sm text-emerald-700">{notice}</p> : null}

      <Button type="button" className="mt-5 h-10 w-full rounded-full" disabled={addStock.isPending} onClick={submit}>
        {addStock.isPending ? "Adding…" : "Add stock"}
      </Button>
    </StockPanel>
  );
}

export function StockDetailPanel({ book, onClose }: { book: BookStockCount; onClose: () => void }) {
  const summary = usePrivateBookStockSummary(book.id);
  const data = summary.data;

  return (
    <StockPanel title={book.title} onClose={onClose}>
      <div className="flex items-start gap-3">
        {book.coverImageUrls[0] ? (
          <Image
            src={book.coverImageUrls[0]}
            alt=""
            width={80}
            height={112}
            unoptimized
            className="h-28 w-20 shrink-0 rounded-md object-cover"
          />
        ) : (
          <BookCover src={null} title={book.title} />
        )}
        <div className="min-w-0">
          <p className="text-sm text-neutral-500">{book.authorName}</p>
          <p className="mt-1 text-sm text-neutral-700">{book.category?.name || "—"}</p>
          <p className="mt-2 text-sm font-medium text-neutral-900">{formatNaira(book.price)}</p>
        </div>
      </div>

      <dl className="mt-5 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
        <Detail label="Stock on hand" value={count(book.stockQuantity)} />
        <Detail label="Weight" value={formatWeightFromGrams(book.weightInGrams)} />
        <Detail label="Best seller" value={book.bestSeller ? "Yes" : "No"} />
        <Detail label="System best seller" value={book.systemBestSeller ? "Yes" : "No"} />
        <Detail label="Best seller override" value={book.bestSellerOverride == null ? "—" : book.bestSellerOverride ? "Yes" : "No"} />
        <Detail label="Delivery" value={book.physicalDeliveryAvailable ? "Available" : "Unavailable"} />
        <Detail label="Pickup" value={book.pickupAvailable ? "Available" : "Unavailable"} />
        <Detail label="Version" value={String(book.version)} />
      </dl>

      <section className="mt-4">
        <h3 className="text-sm font-semibold text-neutral-950">Stock summary</h3>
        {summary.isLoading ? <p className="mt-2 text-sm text-neutral-500">Loading stock summary…</p> : null}
        {summary.error instanceof Error ? <p className="mt-2 text-sm text-danger">{summary.error.message}</p> : null}
        {data ? (
          <dl className="mt-2 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
            {summaryRows.map((row) => (
              <Detail
                key={row.key}
                label={row.label}
                value={typeof data[row.key] === "number" ? count(data[row.key] as number) : String(data[row.key])}
              />
            ))}
          </dl>
        ) : null}
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-semibold text-neutral-950">Description</h3>
        <p className="mt-2 text-sm text-neutral-800">{book.shortDescription}</p>
        <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-neutral-600">{book.description}</p>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-semibold text-neutral-950">Pickup allocations</h3>
        {book.pickupAllocations.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">No pickup allocations.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {book.pickupAllocations.map((allocation) => (
              <li
                key={allocation.pickupLocationId}
                className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
              >
                <p className="font-medium text-neutral-900">{count(allocation.quantity)} copies</p>
                <p className="mt-0.5 text-xs text-neutral-500">{allocation.pickupLocationId}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{allocation.enabled ? "Enabled" : "Disabled"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </StockPanel>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-3 py-2.5">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

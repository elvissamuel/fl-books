"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { OrderBookCover } from "@/components/orders/order-book-cover";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/core/dashboard/format";
import type { OrderDetailStatus } from "@/core/orders/types";
import { useOrderDetail } from "@/features/orders/use-orders";

const statusOptions: OrderDetailStatus[] = [
  "Pending",
  "Shipped",
  "Processing",
  "Delivered",
  "Failed",
];

export function OrderViewPanel({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const { data } = useOrderDetail(orderId);
  const [status, setStatus] = useState<OrderDetailStatus>(data?.status ?? "Pending");
  const [publishedStatus, setPublishedStatus] = useState<OrderDetailStatus>(
    data?.status ?? "Pending",
  );

  useEffect(() => {
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20 motion-safe:animate-[book-scrim-in_480ms_ease-out_both]"
        aria-label="Close order"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-3 right-3 flex w-[min(100%-1.5rem,500px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.16)] outline-none motion-safe:animate-[book-panel-in_520ms_cubic-bezier(0.16,1,0.3,1)_both]"
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-5">
          <h2 id={titleId} className="sr-only">
            Order {data.orderNumber}
          </h2>

          <section className="rounded-xl border border-neutral-200 px-4 py-3.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-400">Order ID</p>
                <p className="mt-1 text-[15px] font-semibold text-neutral-950">{data.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">Status</p>
                <p className="mt-1 inline-flex h-6 items-center rounded-full bg-[#e7f1fb] px-2.5 text-xs font-medium text-[#3b82c4]">
                  {publishedStatus}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 text-sm text-neutral-500">
                Changing Status:
                <span className="relative">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as OrderDetailStatus)}
                    className="h-9 appearance-none rounded-full border border-[#f0b429] bg-white pr-8 pl-3 text-sm text-[#e09a1b] outline-none"
                    aria-label="Changing Status"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#e09a1b]" />
                </span>
              </label>
              <Button
                type="button"
                className="h-9 rounded-lg px-4 text-sm"
                onClick={() => setPublishedStatus(status)}
              >
                Publish
              </Button>
            </div>
          </section>

          <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
            <dl className="grid grid-cols-[148px_1fr] gap-y-3 text-sm">
              <dt className="text-neutral-400">Quantity</dt>
              <dd className="text-neutral-800">{data.quantity}</dd>
              <dt className="text-neutral-400">Weight</dt>
              <dd className="text-neutral-800">{data.weightLabel}</dd>
              <dt className="text-neutral-400">Payment method</dt>
              <dd className="text-neutral-800">{data.paymentMethod}</dd>
              <dt className="text-neutral-400">Date</dt>
              <dd className="text-neutral-800">{data.orderedOn}</dd>
            </dl>
          </section>

          <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
            <h3 className="text-sm font-semibold text-neutral-950">Customer Contact</h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400">Email address</p>
                <p className="mt-1 text-sm text-neutral-800">{data.email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Phone number</p>
                <p className="mt-1 text-sm text-neutral-800">{data.phone}</p>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
            <h3 className="text-sm font-semibold text-neutral-950">Ordered Books breakdown</h3>
            <ul className="mt-3 flex flex-col gap-4">
              {data.lines.map((line) => (
                <li key={line.id} className="flex items-center gap-3">
                  <OrderBookCover />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-950">{line.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Unit price: {formatNaira(line.unitPrice)}
                    </p>
                    <p className="text-xs text-neutral-400">Qty: {line.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-950 tabular-nums">
                    {formatNaira(line.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 ml-auto grid w-[230px] grid-cols-[1fr_auto] gap-y-2 text-sm">
              <dt className="text-neutral-500">Sub total</dt>
              <dd className="text-right text-neutral-800 tabular-nums">{formatNaira(data.subtotal)}</dd>
              <dt className="text-neutral-500">Delivery fee</dt>
              <dd className="text-right text-neutral-800 tabular-nums">
                {formatNaira(data.deliveryFee)}
              </dd>
              <dt className="font-semibold text-neutral-950">Grand Total</dt>
              <dd className="text-right font-semibold text-neutral-950 tabular-nums">
                {formatNaira(data.grandTotal)}
              </dd>
            </dl>
          </section>

          <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
            <h3 className="text-sm font-semibold text-neutral-950">Full shipping address</h3>
            <p className="mt-3 text-sm text-neutral-700">{data.city}</p>
            <p className="text-sm text-neutral-700">{data.address}</p>
          </section>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 h-11 w-full rounded-lg bg-[#fdecec] text-sm font-medium text-[#e35d6a] hover:bg-[#fde2e2]"
          >
            Cancel Order
          </button>
        </div>
      </section>
    </div>
  );
}

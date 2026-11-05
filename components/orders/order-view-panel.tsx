"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { OrderBookCover } from "@/components/orders/order-book-cover";
import type { PrivateOrder } from "@/core/orders/private-api";
import { usePrivateOrder } from "@/features/orders/use-orders";

function formatMoney(amount: number | undefined, currencyCode: string | undefined) {
  const formatted = (amount ?? 0).toLocaleString("en-US");
  if (!currencyCode || currencyCode === "NGN") return `₦${formatted}`;
  return `${currencyCode} ${formatted}`;
}

function formatDate(value: string | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function statusLabel(status: string | undefined) {
  if (!status) return "—";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function providerLabel(provider: string | undefined) {
  if (!provider) return "—";
  return provider.charAt(0) + provider.slice(1).toLowerCase();
}

function customerEmail(order: PrivateOrder) {
  return order.user?.emailAddress || "—";
}

function customerPhone(order: PrivateOrder) {
  return order.user?.phoneNumber || order.recipientPhone || "—";
}

export function OrderViewPanel({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const order = usePrivateOrder(orderId);
  const data = order.data;

  useEffect(() => {
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const books = data?.books ?? [];
  const quantity = books.reduce((sum, book) => sum + (book.quantity || 0), 0);
  const location = data?.pickupLocation;
  const cityLine = [location?.city, location?.state].filter(Boolean).join(", ");

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
            Order {data?.id ?? orderId}
          </h2>

          {order.isLoading ? <p className="text-sm text-neutral-500">Loading order…</p> : null}
          {order.error instanceof Error ? (
            <p className="text-sm text-danger">{order.error.message}</p>
          ) : null}

          {data ? (
            <>
              <section className="rounded-xl border border-neutral-200 px-4 py-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400">Order ID</p>
                    <p className="mt-1 text-[15px] font-semibold break-all text-neutral-950">{data.id}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-neutral-400">Status</p>
                    <p className="mt-1 inline-flex h-6 items-center rounded-full bg-[#e7f1fb] px-2.5 text-xs font-medium text-[#3b82c4]">
                      {statusLabel(data.paymentStatus)}
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <dl className="grid grid-cols-[148px_1fr] gap-y-3 text-sm">
                  <dt className="text-neutral-400">Quantity</dt>
                  <dd className="text-neutral-800">{quantity}</dd>
                  <dt className="text-neutral-400">Weight</dt>
                  <dd className="text-neutral-800">{data.totalWeight}</dd>
                  <dt className="text-neutral-400">Payment method</dt>
                  <dd className="text-neutral-800">{providerLabel(data.payments?.[0]?.provider)}</dd>
                  <dt className="text-neutral-400">Date</dt>
                  <dd className="text-neutral-800">{formatDate(data.createdAt)}</dd>
                </dl>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <h3 className="text-sm font-semibold text-neutral-950">Customer Contact</h3>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-400">Email address</p>
                    <p className="mt-1 text-sm break-all text-neutral-800">{customerEmail(data)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">Phone number</p>
                    <p className="mt-1 text-sm text-neutral-800">{customerPhone(data)}</p>
                  </div>
                </div>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <h3 className="text-sm font-semibold text-neutral-950">Ordered Books breakdown</h3>
                {books.length === 0 ? (
                  <p className="mt-3 text-sm text-neutral-500">No books on this order.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-4">
                    {books.map((line) => {
                      const cover = line.coverImageUrls?.[0];
                      const lineTotal = (line.currentCatalogPrice || 0) * (line.quantity || 0);
                      return (
                        <li key={line.id} className="flex items-center gap-3">
                          {cover ? (
                            <Image
                              src={cover}
                              alt=""
                              width={48}
                              height={68}
                              unoptimized
                              className="h-[68px] w-12 shrink-0 rounded-[3px] object-cover"
                            />
                          ) : (
                            <OrderBookCover />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-neutral-950">{line.title}</p>
                            <p className="mt-0.5 text-xs text-neutral-400">
                              Unit price: {formatMoney(line.currentCatalogPrice, data.currencyCode)}
                            </p>
                            <p className="text-xs text-neutral-400">Qty: {line.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-neutral-950 tabular-nums">
                            {formatMoney(lineTotal, data.currencyCode)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <dl className="mt-4 ml-auto grid w-[230px] grid-cols-[1fr_auto] gap-y-2 text-sm">
                  <dt className="text-neutral-500">Sub total</dt>
                  <dd className="text-right text-neutral-800 tabular-nums">
                    {formatMoney(data.totalBookPrice, data.currencyCode)}
                  </dd>
                  <dt className="text-neutral-500">Delivery fee</dt>
                  <dd className="text-right text-neutral-800 tabular-nums">
                    {formatMoney(data.totalWeightAmount, data.currencyCode)}
                  </dd>
                  <dt className="font-semibold text-neutral-950">Grand Total</dt>
                  <dd className="text-right font-semibold text-neutral-950 tabular-nums">
                    {formatMoney(data.totalAmount, data.currencyCode)}
                  </dd>
                </dl>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <h3 className="text-sm font-semibold text-neutral-950">Full shipping address</h3>
                <p className="mt-3 text-sm text-neutral-700">{cityLine || "—"}</p>
                <p className="text-sm text-neutral-700">{location?.fullAddress || "—"}</p>
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

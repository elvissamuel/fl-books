"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { OrderBookCover } from "@/components/orders/order-book-cover";
import { Button } from "@/components/ui/button";
import {
  fulfilmentStatuses,
  type FulfilmentStatus,
  type PrivateOrder,
} from "@/core/orders/private-api";
import {
  useCancelPrivateOrder,
  usePrivateOrder,
  useUpdateOrderFulfilmentStatus,
} from "@/features/orders/use-orders";

const fulfilmentStatusLabels: Record<FulfilmentStatus, string> = {
  ORDER_PLACED: "Order Placed",
  PACKAGING: "Packaging",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  READY_FOR_PICKUP: "Ready for Pickup",
  READY_FOR_DELIVERY: "Ready for Delivery",
  DELIVERED: "Delivered",
};

function formatMoney(amount: number | undefined) {
  return `N${(amount ?? 0).toLocaleString("en-US")}`;
}

function formatDisplayDate(value: string | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatWeight(value: number | undefined) {
  if (value == null) return "—";
  const kilograms = value > 20 ? value / 1000 : value;
  const rounded = Math.round(kilograms * 10) / 10;
  return `${rounded} kg`;
}

function titleCase(value: string | undefined) {
  if (!value) return "—";
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function orderNumber(order: PrivateOrder) {
  const reference = order.orderReference?.trim();
  if (!reference) return order.id;
  return reference.startsWith("#") ? reference : `#${reference}`;
}

function startingStatus(order: PrivateOrder): FulfilmentStatus {
  const value = order.fulfilmentStatus || order.logisticsType;
  if (fulfilmentStatuses.includes(value as FulfilmentStatus)) return value as FulfilmentStatus;
  return "ORDER_PLACED";
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <div className="mt-1.5 flex h-12 w-full items-center justify-between rounded-lg border border-neutral-200 px-3">
        <span className={value ? "text-sm font-medium text-neutral-900" : "text-sm text-neutral-400"}>
          {value ? formatDisplayDate(value) : "Select date"}
        </span>
        <Calendar className="size-4 text-neutral-500" strokeWidth={1.75} />
      </div>
    </div>
  );
}

export function OrderEditPanel({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const order = usePrivateOrder(orderId);
  const updateStatus = useUpdateOrderFulfilmentStatus();
  const cancelOrder = useCancelPrivateOrder();
  const data = order.data;
  const [status, setStatus] = useState<FulfilmentStatus>("ORDER_PLACED");
  const [publishedStatus, setPublishedStatus] = useState<FulfilmentStatus>("ORDER_PLACED");
  const [error, setError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelNotice, setCancelNotice] = useState("");
  const initializedFor = useRef("");

  useEffect(() => {
    if (!data || initializedFor.current === orderId) return;
    const next = startingStatus(data);
    setStatus(next);
    setPublishedStatus(next);
    initializedFor.current = orderId;
  }, [data, orderId]);

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
  async function requestCancellation() {
    if (!cancelOpen) {
      setCancelOpen(true);
      setCancelError("");
      return;
    }
    const trimmed = reason.trim();
    if (!trimmed) {
      setCancelError("Enter a reason.");
      return;
    }
    setCancelError("");
    setCancelNotice("");
    try {
      const result = await cancelOrder.mutateAsync({ orderId, reason: trimmed });
      if (fulfilmentStatuses.includes(result.fulfilmentStatus)) {
        setStatus(result.fulfilmentStatus);
        setPublishedStatus(result.fulfilmentStatus);
      }
      setReason("");
      setCancelOpen(false);
      setCancelNotice("Cancellation requested.");
    } catch (cancelFailure) {
      setCancelError(
        cancelFailure instanceof Error ? cancelFailure.message : "Could not cancel this order.",
      );
    }
  }

  async function publishStatus() {
    setError("");
    try {
      const result = await updateStatus.mutateAsync({ orderId, status });
      setStatus(result.fulfilmentStatus);
      setPublishedStatus(result.fulfilmentStatus);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Could not update the order status.");
    }
  }

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
            Edit order {data ? orderNumber(data) : orderId}
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
                    <p className="mt-1 text-[15px] font-semibold text-neutral-950">{orderNumber(data)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-neutral-400">Status</p>
                    <p className="mt-1 inline-flex h-6 items-center rounded-full bg-[#e7f1fb] px-2.5 text-xs font-medium text-[#3b82c4]">
                      {fulfilmentStatusLabels[publishedStatus]}
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
                        onChange={(event) => setStatus(event.target.value as FulfilmentStatus)}
                        className="h-9 appearance-none rounded-full border border-[#f0b429] bg-white pr-8 pl-3 text-sm text-[#e09a1b] outline-none"
                        aria-label="Changing Status"
                      >
                        {fulfilmentStatuses.map((option) => (
                          <option key={option} value={option}>
                            {fulfilmentStatusLabels[option]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#e09a1b]" />
                    </span>
                  </label>
                  <Button
                    type="button"
                    className="h-9 rounded-lg bg-brand px-4 text-sm text-white hover:bg-brand-hover"
                    disabled={updateStatus.isPending}
                    onClick={publishStatus}
                  >
                    {updateStatus.isPending ? "Publishing…" : "Publish"}
                  </Button>
                </div>
                {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <dl className="grid grid-cols-[148px_1fr] gap-y-3 text-sm">
                  <dt className="text-neutral-400">Quantity</dt>
                  <dd className="font-medium text-neutral-900">{books.length > 0 ? quantity : "—"}</dd>
                  <dt className="text-neutral-400">Weight</dt>
                  <dd className="font-medium text-neutral-900">{formatWeight(data.totalWeight)}</dd>
                  <dt className="text-neutral-400">Payment method</dt>
                  <dd className="font-medium text-neutral-900">
                    {titleCase(data.payments?.[0]?.provider)}
                  </dd>
                  <dt className="text-neutral-400">Date</dt>
                  <dd className="font-medium text-neutral-900">{formatDisplayDate(data.createdAt) || "—"}</dd>
                </dl>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-950">Expected delivery range</h3>
                  <span className="text-sm font-medium text-[#f47832]">Update</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <DateField label="Start date" value="" />
                  <DateField label="End date" value="" />
                </div>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <h3 className="text-sm font-semibold text-neutral-950">Customer Contact</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-neutral-200 px-3 py-2.5">
                    <p className="text-[11px] text-neutral-400">Email address</p>
                    <p className="mt-1 text-sm break-all text-neutral-800">
                      {data.user?.emailAddress || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 px-3 py-2.5">
                    <p className="text-[11px] text-neutral-400">Phone number</p>
                    <p className="mt-1 text-sm text-neutral-800">
                      {data.user?.phoneNumber || data.recipientPhone || "—"}
                    </p>
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
                              Unit price: {formatMoney(line.currentCatalogPrice)}
                            </p>
                            <p className="text-xs text-neutral-400">Qty: {line.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-neutral-950 tabular-nums">
                            {formatMoney(lineTotal)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <dl className="mt-4 ml-auto grid w-[220px] grid-cols-[1fr_auto] gap-y-2 text-sm">
                  <dt className="text-neutral-500">Sub total</dt>
                  <dd className="text-right text-neutral-800 tabular-nums">
                    {formatMoney(data.totalBookPrice)}
                  </dd>
                  <dt className="text-neutral-500">Delivery fee</dt>
                  <dd className="text-right text-neutral-800 tabular-nums">
                    {formatMoney(data.totalWeightAmount)}
                  </dd>
                  <dt className="font-semibold text-[#1f8f4e]">Grand Total</dt>
                  <dd className="text-right font-semibold text-[#1f8f4e] tabular-nums">
                    {formatMoney(data.totalAmount)}
                  </dd>
                </dl>
              </section>

              <section className="mt-3 rounded-xl border border-neutral-200 px-4 py-3.5">
                <h3 className="text-sm font-semibold text-neutral-950">Full shipping address</h3>
                <p className="mt-3 text-sm text-neutral-700">
                  {cityLine ? `City: ${cityLine}.` : "—"}
                </p>
                <p className="text-sm font-medium text-neutral-900">{location?.fullAddress || "—"}</p>
              </section>

              {cancelOpen ? (
                <label className="mt-4 block text-sm text-neutral-500">
                  Reason
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Enter a reason"
                    rows={3}
                    className="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-[#e35d6a]"
                  />
                </label>
              ) : null}
              <button
                type="button"
                disabled={cancelOrder.isPending}
                onClick={requestCancellation}
                className="mt-4 h-11 w-full rounded-lg bg-[#fdecec] text-sm font-medium text-[#e35d6a] hover:bg-[#fde2e2] disabled:opacity-70"
              >
                {cancelOrder.isPending ? "Cancelling…" : "Cancel Order"}
              </button>
              {cancelError ? <p className="mt-2 text-center text-sm text-danger">{cancelError}</p> : null}
              {cancelNotice ? <p className="mt-2 text-center text-sm text-[#1f8f4e]">{cancelNotice}</p> : null}

            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef } from "react";
import { ArrowLeft, Mail, MapPin, Phone, ShoppingBag, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNaira } from "@/core/dashboard/format";
import type { CustomerPurchaseStatus, CustomerStatus } from "@/core/customers/types";
import { useCustomerDetail } from "@/features/customers/use-customers";
import { cn } from "@/lib/utils";

const customerStatusStyles: Record<CustomerStatus, string> = {
  active: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  inactive: "border-neutral-200 bg-[#f7f7f8] text-neutral-400",
};

const purchaseStatusStyles: Record<CustomerPurchaseStatus, string> = {
  shipped: "border-[#e6d3a1] bg-[#fbf8f1] text-[#c6a15a]",
  delivered: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
};

const purchaseStatusLabels: Record<CustomerPurchaseStatus, string> = {
  shipped: "Shipped",
  delivered: "Delivered",
};

export function CustomerViewPanel({
  customerId,
  onClose,
}: {
  customerId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const { data } = useCustomerDetail(customerId);

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
        aria-label="Close customer"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-3 right-3 flex w-[min(100%-1.5rem,560px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.16)] outline-none motion-safe:animate-[book-panel-in_520ms_cubic-bezier(0.16,1,0.3,1)_both]"
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
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-500">
              {data.initials}
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
                {data.name}
              </h2>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" strokeWidth={1.75} />
                  {data.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3.5" strokeWidth={1.75} />
                  {data.phone}
                </span>
              </p>
            </div>
          </div>

          <section className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-neutral-200 px-4 py-4">
            <div className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="text-xs text-neutral-400">Email Address</p>
                <p className="mt-0.5 truncate text-sm text-neutral-800">{data.email}</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <ShoppingBag className="mt-0.5 size-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
              <div>
                <p className="text-xs text-neutral-400">Total orders</p>
                <p className="mt-0.5 text-sm text-neutral-800">{data.totalOrders}</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Wallet className="mt-0.5 size-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
              <div>
                <p className="text-xs text-neutral-400">Total Spent</p>
                <p className="mt-0.5 text-sm font-medium text-neutral-900">
                  {formatNaira(data.totalSpent)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Badge
                variant="outline"
                className={cn(
                  "h-6 rounded-full px-2.5 text-xs font-medium",
                  customerStatusStyles[data.status],
                )}
              >
                {data.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </section>

          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
            <Table>
              <TableHeader className="bg-[#f7f7f8]">
                <TableRow className="border-neutral-100 hover:bg-transparent">
                  {["Item code", "Name", "Quantity", "Status"].map((heading, index) => (
                    <TableHead
                      key={heading}
                      className={cn(
                        "h-10 text-xs font-medium text-neutral-500",
                        index === 0 && "pl-4",
                        index === 3 && "pr-4",
                      )}
                    >
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.purchases.map((purchase) => (
                  <TableRow key={purchase.id} className="border-neutral-100 hover:bg-transparent">
                    <TableCell className="py-3.5 pl-4 text-sm text-neutral-700">
                      {purchase.itemCode}
                    </TableCell>
                    <TableCell className="py-3.5 text-sm text-neutral-700">{purchase.name}</TableCell>
                    <TableCell className="py-3.5 text-sm text-neutral-700 tabular-nums">
                      {purchase.quantity}
                    </TableCell>
                    <TableCell className="py-3.5 pr-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-6 rounded-full px-2.5 text-xs font-medium",
                          purchaseStatusStyles[purchase.status],
                        )}
                      >
                        {purchaseStatusLabels[purchase.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}

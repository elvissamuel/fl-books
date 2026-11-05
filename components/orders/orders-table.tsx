"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PrivateOrder } from "@/core/orders/private-api";
import { cn } from "@/lib/utils";

function customerName(order: PrivateOrder) {
  const name = [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ").trim();
  return name || order.recipientName?.trim() || "—";
}

function customerEmail(order: PrivateOrder) {
  return order.user?.emailAddress || "—";
}

function logisticsLabel(order: PrivateOrder) {
  if (order.logisticsType === "PICK_UP" || order.logisticsType === "PICKUP") return "Pickup";
  if (order.logisticsType === "DELIVERY") return "Delivery";
  return "—";
}

function bookLabel(order: PrivateOrder) {
  const books = order.books ?? [];
  if (books.length === 0) return "—";
  if (books.length === 1) return books[0]?.title || "—";
  return `${books[0]?.title || "Book"} +${books.length - 1}`;
}

function orderQuantity(order: PrivateOrder) {
  return (order.books ?? []).reduce((sum, book) => sum + (book.quantity || 0), 0);
}

function statusLabel(status: string | undefined) {
  if (!status) return "—";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusClass(status: string | undefined) {
  const value = status?.toUpperCase();
  if (value === "SUCCESS" || value === "DELIVERED" || value === "PAID") {
    return "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]";
  }
  if (value === "FAILED" || value === "CANCELLED" || value === "CANCELED") {
    return "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]";
  }
  if (value === "SHIPPED" || value === "PENDING") {
    return "border-[#e6d3a1] bg-[#fbf8f1] text-[#c6a15a]";
  }
  return "border-neutral-200 bg-[#f7f7f8] text-neutral-400";
}

function formatMoney(amount: number | undefined, currencyCode: string | undefined) {
  const formatted = (amount ?? 0).toLocaleString("en-US");
  if (!currencyCode || currencyCode === "NGN") return `₦${formatted}`;
  return `${currencyCode} ${formatted}`;
}

const headings = [
  "Customer name",
  "Email",
  "Type",
  "Amount",
  "Book type",
  "Price",
  "Qty",
  "Status",
  "Action",
];

function SkeletonBar({ className }: { className: string }) {
  return <span className={cn("block animate-pulse rounded-md bg-neutral-200", className)} />;
}

const skeletonWidths = ["w-32", "w-40", "w-16", "w-16", "w-20", "w-16", "w-8"] as const;

export function OrdersTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card
      className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading orders</span>
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            {headings.map((heading, index) => (
              <TableHead
                key={heading}
                className={cn(
                  "h-11 text-xs font-medium text-neutral-500",
                  index === 0 && "pl-5",
                  index === headings.length - 1 && "pr-5",
                )}
              >
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index} className="border-neutral-100 hover:bg-transparent">
              {skeletonWidths.map((width, cellIndex) => (
                <TableCell key={cellIndex} className={cn("py-4", cellIndex === 0 && "pl-5")}>
                  <SkeletonBar className={cn("h-3.5", width)} />
                </TableCell>
              ))}
              <TableCell className="py-4">
                <SkeletonBar className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="py-4 pr-5">
                <SkeletonBar className="h-4 w-14" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function OrdersTable({
  orders,
  onView,
}: {
  orders: PrivateOrder[];
  onView: (order: PrivateOrder) => void;
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            {headings.map((heading, index) => (
              <TableHead
                key={heading}
                className={cn(
                  "h-11 text-xs font-medium text-neutral-500",
                  index === 0 && "pl-5",
                  index === headings.length - 1 && "pr-5",
                )}
              >
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={9} className="py-12 text-center text-sm text-neutral-500">
                No orders found.
              </TableCell>
            </TableRow>
          ) : null}
          {orders.map((order) => (
            <TableRow key={order.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-4 pl-5 text-sm text-neutral-700">{customerName(order)}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{customerEmail(order)}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{logisticsLabel(order)}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {formatMoney(order.totalAmount, order.currencyCode)}
              </TableCell>
              <TableCell className="max-w-[180px] truncate py-4 text-sm text-neutral-700">
                {bookLabel(order)}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {formatMoney(order.totalBookPrice, order.currencyCode)}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {orderQuantity(order)}
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    statusClass(order.paymentStatus),
                  )}
                >
                  {statusLabel(order.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 pr-5">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 gap-1.5 px-2 text-sm font-normal text-neutral-500 hover:bg-transparent hover:text-neutral-800"
                  onClick={() => onView(order)}
                >
                  <Eye className="size-4" strokeWidth={1.75} />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

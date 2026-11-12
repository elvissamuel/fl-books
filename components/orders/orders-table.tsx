"use client";

import { Eye, MoreVertical, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FulfilmentStatus, PrivateOrder } from "@/core/orders/private-api";
import { cn } from "@/lib/utils";

function customerName(order: PrivateOrder) {
  const name = [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ").trim();
  return name || order.recipientName?.trim() || "—";
}

function customerEmail(order: PrivateOrder) {
  return order.user?.emailAddress || "—";
}

const logisticsLabels: Record<string, string> = {
  PICK_UP: "Pickup",
  PICKUP: "Pickup",
  DELIVERY: "Delivery",
  PACKAGING: "Packaging",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  READY_FOR_PICKUP: "Ready for Pickup",
  DELIVERED: "Delivered",
};

function logisticsLabel(order: PrivateOrder) {
  return logisticsLabels[order.logisticsType] ?? "—";
}

const fulfilmentStatusLabels: Record<FulfilmentStatus, string> = {
  ORDER_PLACED: "Order Placed",
  PACKAGING: "Packaging",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  READY_FOR_PICKUP: "Ready for Pickup",
  READY_FOR_DELIVERY: "Ready for Delivery",
  DELIVERED: "Delivered",
};

function fulfilmentLabel(status: string | null | undefined) {
  if (!status) return "—";
  return fulfilmentStatusLabels[status as FulfilmentStatus] ?? status;
}

function statusClass(status: string | null | undefined) {
  const value = status?.toUpperCase();
  if (value === "DELIVERED") {
    return "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]";
  }
  if (value === "SHIPPED" || value === "IN_TRANSIT" || value === "READY_FOR_PICKUP" || value === "READY_FOR_DELIVERY") {
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
  "Order ID",
  "Customer name",
  "Email",
  "Logistics Type",
  "Amount",
  "Price",
  "Fulfilment Status",
  "Action",
];

function SkeletonBar({ className }: { className: string }) {
  return <span className={cn("block animate-pulse rounded-md bg-neutral-200", className)} />;
}

const skeletonWidths = ["w-28", "w-32", "w-40", "w-20", "w-16", "w-16"] as const;

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
  onEdit,
}: {
  orders: PrivateOrder[];
  onView: (order: PrivateOrder) => void;
  onEdit: (order: PrivateOrder) => void;
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
              <TableCell colSpan={8} className="py-12 text-center text-sm text-neutral-500">
                No orders found.
              </TableCell>
            </TableRow>
          ) : null}
          {orders.map((order) => (
            <TableRow key={order.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-4 pl-5 text-sm text-neutral-700">
                {order.orderReference?.trim() || "—"}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{customerName(order)}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{customerEmail(order)}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{logisticsLabel(order)}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {formatMoney(order.totalAmount, order.currencyCode)}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {formatMoney(order.totalBookPrice, order.currencyCode)}
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    statusClass(order.fulfilmentStatus),
                  )}
                >
                  {fulfilmentLabel(order.fulfilmentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 pr-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-neutral-500 hover:bg-transparent"
                      aria-label={`Actions for ${order.orderReference || "order"}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onView(order)}>
                      <Eye className="size-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(order)}>
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

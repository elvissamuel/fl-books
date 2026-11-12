"use client";

import Link from "next/link";
import { MoreVertical, Truck } from "lucide-react";
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
import { formatNaira } from "@/core/dashboard/format";
import type { RecentOrder } from "@/core/dashboard/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  shipped: "bg-emerald-50 text-emerald-600",
  pending: "bg-rose-50 text-rose-500",
  DELIVERED: "bg-emerald-50 text-emerald-600",
  SHIPPED: "bg-amber-50 text-amber-700",
  IN_TRANSIT: "bg-amber-50 text-amber-700",
  READY_FOR_PICKUP: "bg-amber-50 text-amber-700",
  READY_FOR_DELIVERY: "bg-amber-50 text-amber-700",
};

function statusLabel(status: string) {
  const known: Record<string, string> = {
    shipped: "Shipped",
    pending: "Pending",
    ORDER_PLACED: "Order Placed",
    PACKAGING: "Packaging",
    SHIPPED: "Shipped",
    IN_TRANSIT: "In Transit",
    READY_FOR_PICKUP: "Ready for Pickup",
    READY_FOR_DELIVERY: "Ready for Delivery",
    DELIVERED: "Delivered",
  };
  return known[status] ?? status;
}

function money(amount: number, currencyCode: string) {
  if (!currencyCode || currencyCode === "NGN") return formatNaira(amount);
  if (currencyCode === "USD") return `$${amount.toLocaleString("en-US")}`;
  return `${currencyCode} ${amount.toLocaleString("en-US")}`;
}

export function RecentOrdersCard({ orders }: { orders: RecentOrder[] }) {
  return (
    <Card className="gap-0 py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <div className="relative flex h-12 items-center justify-end border-b border-neutral-100 px-4">
        <h2 className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-900">
          Recent Orders
        </h2>
        <Link href="/admin/orders" className="relative text-[13px] text-neutral-500 hover:text-neutral-800">
          View all orders
        </Link>
      </div>
      <Table>
        <TableHeader className="bg-neutral-50/80">
          <TableRow className="hover:bg-transparent">
            {["Order ID", "Customer", "Type", "Amount", "Book type", "Price", "Qty", "Status", "Action"].map(
              (heading) => (
                <TableHead
                  key={heading}
                  className="h-10 text-xs font-medium text-neutral-500"
                >
                  {heading}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={9} className="py-10 text-center text-sm text-neutral-500">
                No recent orders.
              </TableCell>
            </TableRow>
          ) : null}
          {orders.map((order, index) => (
            <TableRow key={`${order.id}-${index}`} className="hover:bg-neutral-50/60">
              <TableCell className="text-[13px] font-medium text-neutral-800">{order.id}</TableCell>
              <TableCell className="text-[13px] text-neutral-700">{order.customer}</TableCell>
              <TableCell className="text-[13px] text-neutral-700">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="size-3.5 text-neutral-400" strokeWidth={1.75} />
                  {order.type}
                </span>
              </TableCell>
              <TableCell className="text-[13px] text-neutral-700 tabular-nums">
                {money(order.amount, order.currencyCode)}
              </TableCell>
              <TableCell className="text-[13px] text-neutral-700">{order.bookType}</TableCell>
              <TableCell className="text-[13px] text-neutral-700 tabular-nums">
                {money(order.price, order.currencyCode)}
              </TableCell>
              <TableCell className="text-[13px] text-neutral-700 tabular-nums">{order.quantity}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full border-0 px-2.5 font-medium capitalize",
                    statusStyles[order.status] ?? "bg-neutral-100 text-neutral-500",
                  )}
                >
                  {statusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-neutral-500"
                      aria-label={`Actions for ${order.id}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View order</DropdownMenuItem>
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

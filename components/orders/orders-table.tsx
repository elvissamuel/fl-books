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
import { formatNaira } from "@/core/dashboard/format";
import type { Order, OrderStatus } from "@/core/orders/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<OrderStatus, string> = {
  shipped: "border-[#e6d3a1] bg-[#fbf8f1] text-[#c6a15a]",
  processing: "border-neutral-200 bg-[#f7f7f8] text-neutral-400",
  delivered: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  failed: "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
};

const statusLabels: Record<OrderStatus, string> = {
  shipped: "Shipped",
  processing: "Processing",
  delivered: "Delivered",
  failed: "Failed",
};

const headings = [
  "Order ID",
  "Customer",
  "Type",
  "Amount",
  "Book type",
  "Price",
  "Qty",
  "Status",
  "Action",
];

export function OrdersTable({
  orders,
  onView,
}: {
  orders: Order[];
  onView: (order: Order) => void;
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
              <TableCell className="py-4 pl-5 text-sm text-neutral-700">{order.orderId}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{order.customer}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{order.type}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {formatNaira(order.amount)}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{order.bookType}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {formatNaira(order.price)}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700 tabular-nums">
                {order.quantity}
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    statusStyles[order.status],
                  )}
                >
                  {statusLabels[order.status]}
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

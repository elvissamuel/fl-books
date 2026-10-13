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
import type { OrderStatus } from "@/core/dashboard/types";
import { useRecentOrders } from "@/features/dashboard/use-dashboard";
import { cn } from "@/lib/utils";

const statusStyles: Record<OrderStatus, string> = {
  shipped: "bg-emerald-50 text-emerald-600",
  pending: "bg-rose-50 text-rose-500",
};

const statusLabels: Record<OrderStatus, string> = {
  shipped: "Shipped",
  pending: "Pending",
};

export function RecentOrdersCard() {
  const { data } = useRecentOrders();

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
          {data?.map((order, index) => (
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
                {formatNaira(order.amount)}
              </TableCell>
              <TableCell className="text-[13px] text-neutral-700">{order.bookType}</TableCell>
              <TableCell className="text-[13px] text-neutral-700 tabular-nums">
                {formatNaira(order.price)}
              </TableCell>
              <TableCell className="text-[13px] text-neutral-700 tabular-nums">{order.quantity}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full border-0 px-2.5 font-medium capitalize",
                    statusStyles[order.status],
                  )}
                >
                  {statusLabels[order.status]}
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

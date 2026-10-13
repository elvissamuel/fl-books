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
import type { Customer, CustomerStatus } from "@/core/customers/types";
import { formatNaira } from "@/core/dashboard/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<CustomerStatus, string> = {
  active: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  inactive: "border-neutral-200 bg-[#f7f7f8] text-neutral-400",
};

const statusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

const headings = ["Name", "Email", "Phone", "Total Orders", "Total spent", "Status", "Action"];

export function CustomersTable({
  customers,
  onView,
}: {
  customers: Customer[];
  onView: (customer: Customer) => void;
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
          {customers.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="py-12 text-center text-sm text-neutral-500">
                No customers found.
              </TableCell>
            </TableRow>
          ) : null}
          {customers.map((customer) => (
            <TableRow key={customer.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-3.5 pl-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-medium text-neutral-500">
                    {customer.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{customer.name}</p>
                    <p className="text-xs text-neutral-400">{customer.location}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700">{customer.email}</TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700">{customer.phone}</TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700 tabular-nums">
                {customer.totalOrders}
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700 tabular-nums">
                {formatNaira(customer.totalSpent)}
              </TableCell>
              <TableCell className="py-3.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    statusStyles[customer.status],
                  )}
                >
                  {statusLabels[customer.status]}
                </Badge>
              </TableCell>
              <TableCell className="py-3.5 pr-5">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 gap-1.5 px-2 text-sm font-normal text-neutral-500 hover:bg-transparent hover:text-neutral-800"
                  onClick={() => onView(customer)}
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

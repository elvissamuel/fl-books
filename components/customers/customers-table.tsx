"use client";

import { Eye, MoreVertical } from "lucide-react";
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
import type { AdminCustomer } from "@/core/customers/admin-api";
import { cn } from "@/lib/utils";

const headings = ["Name", "Email", "Phone", "Gender", "Verified", "Status", "Action"];

function displayName(customer: AdminCustomer) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return name || customer.emailAddress;
}

function initials(customer: AdminCustomer) {
  const parts = [customer.firstName, customer.lastName].filter((part): part is string => Boolean(part));
  if (parts.length === 0) return customer.emailAddress.slice(0, 2).toUpperCase();
  return parts
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function genderLabel(customer: AdminCustomer) {
  if (customer.gender === "MALE") return "Male";
  if (customer.gender === "FEMALE") return "Female";
  return "—";
}

export function CustomersTable({
  customers,
  onView,
  onActivate,
  onDeactivate,
}: {
  customers: AdminCustomer[];
  onView: (customer: AdminCustomer) => void;
  onActivate: (customer: AdminCustomer) => void;
  onDeactivate: (customer: AdminCustomer) => void;
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
            <TableRow key={customer.customerId} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-3.5 pl-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-medium text-neutral-500">
                    {initials(customer)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{displayName(customer)}</p>
                    <p className="text-xs text-neutral-400">{customer.customerNumber}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700">{customer.emailAddress}</TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700">
                {customer.phoneNumber || "—"}
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700">{genderLabel(customer)}</TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-700">
                {customer.verified ? "Verified" : "Unverified"}
              </TableCell>
              <TableCell className="py-3.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    customer.active
                      ? "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]"
                      : "border-neutral-200 bg-[#f7f7f8] text-neutral-400",
                  )}
                >
                  {customer.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="py-3.5 pr-5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-neutral-500 hover:bg-transparent"
                      aria-label={`Actions for ${displayName(customer)}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onView(customer)}>
                      <Eye className="size-4" />
                      View
                    </DropdownMenuItem>
                    {customer.active ? (
                      <DropdownMenuItem onSelect={() => onDeactivate(customer)}>
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onSelect={() => onActivate(customer)}>
                        Activate
                      </DropdownMenuItem>
                    )}
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

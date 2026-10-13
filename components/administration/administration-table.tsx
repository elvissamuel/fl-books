"use client";

import { MoreVertical } from "lucide-react";
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
import type { AdminStatus, StaffAdmin } from "@/core/administration/types";
import { cn } from "@/lib/utils";

const headings = ["Name", "Email", "Phone", "Permissions", "Username", "Status", "Action"];

const statusStyles: Record<AdminStatus, string> = {
  active: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  inactive: "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
};

const statusLabels: Record<AdminStatus, string> = {
  active: "Active",
  inactive: "inactive",
};

export function AdministrationTable({ admins }: { admins: StaffAdmin[] }) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-none ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            {headings.map((heading, index) => (
              <TableHead
                key={heading}
                className={cn(
                  "h-11 text-xs font-medium text-neutral-400",
                  index === 0 && "pl-5",
                  index === headings.length - 1 && "pr-5",
                )}
              >
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {admins.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="py-12 text-center text-sm text-neutral-500">
                No admins found.
              </TableCell>
            </TableRow>
          ) : null}
          {admins.map((admin) => (
            <TableRow key={admin.id} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-3.5 pl-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-medium text-neutral-500">
                    {admin.initials}
                  </span>
                  <span className="text-sm text-neutral-800">{admin.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-800">{admin.email}</TableCell>
              <TableCell className="py-3.5 text-sm tracking-wide text-neutral-800">
                {admin.phoneMask}
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-800">
                {admin.permissionsLabel}
              </TableCell>
              <TableCell className="py-3.5 text-sm tracking-wide text-neutral-800">
                {admin.usernameMask}
              </TableCell>
              <TableCell className="py-3.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    statusStyles[admin.status],
                  )}
                >
                  {statusLabels[admin.status]}
                </Badge>
              </TableCell>
              <TableCell className="py-3.5 pr-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-neutral-500 hover:bg-transparent"
                  aria-label={`Actions for ${admin.name}`}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
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
import type { AdminAccount, AdminModule } from "@/core/auth/admin-api";
import { cn } from "@/lib/utils";

const headings = ["Name", "Email", "Phone", "Permissions", "Status", "Action"];

const moduleLabels: Record<AdminModule, string> = {
  BOOK: "Books",
  CUSTOMER: "Customers",
  CURRENCY: "Currency",
  DISTANCE_BAND: "Distance bands",
  PLATFORM_SETTINGS: "Platform settings",
  ADMIN: "Administration",
  ACTIVITY_LOG: "Activity log",
};

export function AdministrationTable({
  admins,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: {
  admins: AdminAccount[];
  onEdit: (admin: AdminAccount) => void;
  onActivate: (admin: AdminAccount) => void;
  onDeactivate: (admin: AdminAccount) => void;
  onDelete: (admin: AdminAccount) => void;
}) {
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
              <TableCell colSpan={6} className="py-12 text-center text-sm text-neutral-500">
                No admins found.
              </TableCell>
            </TableRow>
          ) : null}
          {admins.map((admin) => {
            const name = `${admin.firstName} ${admin.lastName}`.trim();
            return (
              <TableRow key={admin.adminId} className="border-neutral-100 hover:bg-transparent">
                <TableCell className="py-3.5 pl-5">
                  <div className="flex items-center gap-3">
                    <AdminAvatar admin={admin} />
                    <span className="text-sm text-neutral-800">{name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 text-sm text-neutral-800">{admin.emailAddress}</TableCell>
                <TableCell className="py-3.5 text-sm text-neutral-800">
                  {admin.phoneNumber || "—"}
                </TableCell>
                <TableCell className="max-w-[220px] py-3.5 text-sm text-neutral-800">
                  <span className="line-clamp-2">{permissionSummary(admin)}</span>
                </TableCell>
                <TableCell className="py-3.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 rounded-full px-2.5 text-xs font-medium",
                      admin.active
                        ? "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]"
                        : "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
                    )}
                  >
                    {admin.active ? "Active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3.5 pr-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-neutral-500 hover:bg-transparent"
                        aria-label={`Actions for ${name}`}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit(admin)}>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      {admin.active ? (
                        <DropdownMenuItem onSelect={() => onDeactivate(admin)}>
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onSelect={() => onActivate(admin)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(admin)}>
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

function permissionSummary(admin: AdminAccount) {
  const labels = (admin.permissions ?? []).map((group) => moduleLabels[group.module]).filter(Boolean);
  return labels.length > 0 ? labels.join(", ") : "None";
}

function AdminAvatar({ admin }: { admin: AdminAccount }) {
  const initials = `${admin.firstName.charAt(0)}${admin.lastName.charAt(0)}`.toUpperCase();
  if (admin.profilePictureUrl) {
    return (
      <Image
        src={admin.profilePictureUrl}
        alt=""
        width={32}
        height={32}
        unoptimized
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  const colour = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(admin.profileColourCode ?? "")
    ? admin.profileColourCode
    : undefined;

  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-medium text-neutral-500"
      style={colour ? { backgroundColor: colour, color: "#fff" } : undefined}
    >
      {initials || "NA"}
    </span>
  );
}

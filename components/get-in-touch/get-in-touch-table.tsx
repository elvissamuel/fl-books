"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GetInTouchMessage } from "@/core/get-in-touch/private-api";
import { cn } from "@/lib/utils";

const headings = ["Name", "Email", "Subject", "Message", "Date"] as const;

function SkeletonBar({ className }: { className: string }) {
  return <span className={cn("block animate-pulse rounded-md bg-neutral-200", className)} />;
}

function sentOn(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("en-GB");
}

export function GetInTouchTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <Card
      className="gap-0 overflow-hidden py-0 shadow-none ring-neutral-200/80"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading messages</span>
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
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-5 pl-5">
                <SkeletonBar className="h-3.5 w-28" />
              </TableCell>
              <TableCell className="py-5">
                <SkeletonBar className="h-3.5 w-40" />
              </TableCell>
              <TableCell className="py-5">
                <SkeletonBar className="h-3.5 w-32" />
              </TableCell>
              <TableCell className="py-5">
                <SkeletonBar className="h-3.5 w-56" />
              </TableCell>
              <TableCell className="py-5 pr-5">
                <SkeletonBar className="h-3.5 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function GetInTouchTable({ messages }: { messages: GetInTouchMessage[] }) {
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
          {messages.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-12 text-center text-sm text-neutral-500">
                No messages found.
              </TableCell>
            </TableRow>
          ) : null}
          {messages.map((item) => (
            <TableRow key={item.id} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-5 pl-5 text-sm text-neutral-800">{item.name || "—"}</TableCell>
              <TableCell className="py-5 text-sm text-neutral-800">{item.email || "—"}</TableCell>
              <TableCell className="max-w-[180px] py-5 text-sm text-neutral-800">
                <span className="block truncate">{item.subject || "—"}</span>
              </TableCell>
              <TableCell className="max-w-[280px] py-5 text-sm text-neutral-800">
                <span className="block truncate" title={item.message}>
                  {item.message || "—"}
                </span>
              </TableCell>
              <TableCell className="py-5 pr-5 text-sm text-neutral-800">{sentOn(item.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

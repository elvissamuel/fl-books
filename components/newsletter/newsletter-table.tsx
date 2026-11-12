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
import type { NewsletterSubscription } from "@/core/newsletter/private-api";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className: string }) {
  return <span className={cn("block animate-pulse rounded-md bg-neutral-200", className)} />;
}

export function NewsletterTableSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <Card
      className="gap-0 overflow-hidden py-0 shadow-none ring-neutral-200/80"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading subscribers</span>
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 pl-5 text-xs font-medium text-neutral-400">Email</TableHead>
            <TableHead className="h-11 pr-5 text-right text-xs font-medium text-neutral-400">
              Date Subscribed
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-5 pl-5">
                <SkeletonBar className="h-3.5 w-56" />
              </TableCell>
              <TableCell className="py-5 pr-5">
                <SkeletonBar className="ml-auto h-3.5 w-28" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function subscribedOn(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("en-GB");
}

export function NewsletterTable({ subscribers }: { subscribers: NewsletterSubscription[] }) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-none ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 pl-5 text-xs font-medium text-neutral-400">Email</TableHead>
            <TableHead className="h-11 pr-5 text-right text-xs font-medium text-neutral-400">
              Date Subscribed
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {subscribers.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2} className="py-12 text-center text-sm text-neutral-500">
                No subscribers found.
              </TableCell>
            </TableRow>
          ) : null}
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber.id} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-5 pl-5 text-sm text-neutral-800">{subscriber.email}</TableCell>
              <TableCell className="py-5 pr-5 text-right text-sm text-neutral-800">
                {subscribedOn(subscriber.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

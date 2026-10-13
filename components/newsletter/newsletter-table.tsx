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
import type { NewsletterSubscriber } from "@/core/newsletter/types";

export function NewsletterTable({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
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
                {subscriber.subscribedOn}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

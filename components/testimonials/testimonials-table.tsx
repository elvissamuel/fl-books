"use client";

import { MoreVertical } from "lucide-react";
import Image from "next/image";
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
import type { Testimonial } from "@/core/testimonials/types";

const headings = ["Name", "Role", "Message", "Action"] as const;

export function TestimonialsTable({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-none ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 w-[26%] pl-5 text-xs font-medium text-neutral-400">
              {headings[0]}
            </TableHead>
            <TableHead className="h-11 w-[22%] text-xs font-medium text-neutral-400">
              {headings[1]}
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-400">{headings[2]}</TableHead>
            <TableHead className="h-11 w-24 pr-5 text-xs font-medium text-neutral-400">
              {headings[3]}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {testimonials.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="py-12 text-center text-sm text-neutral-500">
                No testimonials found.
              </TableCell>
            </TableRow>
          ) : null}
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-3.5 pl-5">
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatarSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-full object-cover"
                  />
                  <span className="text-sm text-neutral-800">{testimonial.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-800">{testimonial.role}</TableCell>
              <TableCell className="py-3.5 text-sm text-neutral-800">{testimonial.message}</TableCell>
              <TableCell className="py-3.5 pr-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-neutral-500 hover:bg-transparent"
                  aria-label={`Actions for ${testimonial.name}`}
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

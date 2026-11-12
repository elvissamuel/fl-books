"use client";

import Image from "next/image";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
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
import type { BookCategory } from "@/core/book-categories/category";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className: string }) {
  return <span className={cn("block animate-pulse rounded-md bg-neutral-200", className)} />;
}

export function CategoriesTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card
      className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading categories</span>
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 pl-5 text-xs font-medium text-neutral-500">Category Name</TableHead>
            <TableHead className="h-11 pr-5 text-right text-xs font-medium text-neutral-500">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-3.5 pl-5">
                <div className="flex items-center gap-3 py-1">
                  <span className="block size-10 shrink-0 animate-pulse rounded-md bg-neutral-200" />
                  <SkeletonBar className="h-3.5 w-40" />
                </div>
              </TableCell>
              <TableCell className="pr-5">
                <span className="ml-auto block size-7 animate-pulse rounded-md bg-neutral-200" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: {
  categories: BookCategory[];
  onEdit: (category: BookCategory) => void;
  onDelete: (category: BookCategory) => void;
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 pl-5 text-xs font-medium text-neutral-500">Category Name</TableHead>
            <TableHead className="h-11 pr-5 text-right text-xs font-medium text-neutral-500">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2} className="py-12 text-center text-sm text-neutral-500">
                No categories found.
              </TableCell>
            </TableRow>
          ) : null}
          {categories.map((category) => (
            <TableRow key={category.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-3.5 pl-5">
                <div className="flex items-center gap-3 py-1">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="block size-10 shrink-0 rounded-md bg-neutral-200" />
                  )}
                  <span className="text-sm font-medium text-neutral-900">{category.name}</span>
                </div>
              </TableCell>
              <TableCell className="pr-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-neutral-500 hover:bg-transparent"
                      aria-label={`Actions for ${category.name}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit(category)}>
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(category)}>
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
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

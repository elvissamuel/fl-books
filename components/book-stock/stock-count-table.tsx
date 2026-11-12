"use client";

import { Eye, MoreVertical, Plus } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
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
import { formatWeightFromGrams } from "@/core/books/format";
import type { BookStockCount } from "@/core/books/stock-api";
import { formatNaira } from "@/core/dashboard/format";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className: string }) {
  return <span className={cn("block animate-pulse rounded-md bg-neutral-200", className)} />;
}

export function StockCountTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <Card
      className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading stock</span>
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 pl-4 text-xs font-medium text-neutral-500">Product Details</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Category</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Price</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Stock</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Weight</TableHead>
            <TableHead className="h-11 pr-4 text-xs font-medium text-neutral-500">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index} className="border-neutral-100 hover:bg-transparent">
              <TableCell className="py-3.5 pl-4">
                <div className="flex items-center gap-3">
                  <span className="block h-14 w-10 shrink-0 animate-pulse rounded-[3px] bg-neutral-200" />
                  <div className="space-y-2">
                    <SkeletonBar className="h-3.5 w-40" />
                    <SkeletonBar className="h-3 w-24" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <SkeletonBar className="h-3.5 w-28" />
              </TableCell>
              <TableCell>
                <SkeletonBar className="h-3.5 w-16" />
              </TableCell>
              <TableCell>
                <SkeletonBar className="h-3.5 w-12" />
              </TableCell>
              <TableCell>
                <SkeletonBar className="h-3.5 w-12" />
              </TableCell>
              <TableCell className="pr-3">
                <span className="block size-7 animate-pulse rounded-md bg-neutral-200" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function StockCountTable({
  books,
  onAdd,
  onView,
}: {
  books: BookStockCount[];
  onAdd: (book: BookStockCount) => void;
  onView: (book: BookStockCount) => void;
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 pl-4 text-xs font-medium text-neutral-500">Product Details</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Category</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Price</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Stock</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Weight</TableHead>
            <TableHead className="h-11 pr-4 text-xs font-medium text-neutral-500">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-12 text-center text-sm text-neutral-500">
                No books found.
              </TableCell>
            </TableRow>
          ) : null}
          {books.map((book) => (
            <TableRow key={book.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-3.5 pl-4">
                <div className="flex items-center gap-3 py-1">
                  <BookCover src={book.coverImageUrls[0] ?? null} title={book.title} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{book.title}</p>
                    <p className="text-xs text-neutral-500">{book.authorName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-neutral-700">{book.category?.name || "—"}</TableCell>
              <TableCell className="text-sm text-neutral-700 tabular-nums">{formatNaira(book.price)}</TableCell>
              <TableCell className="text-sm text-neutral-700 tabular-nums">
                {book.stockQuantity.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="text-sm text-neutral-700">{formatWeightFromGrams(book.weightInGrams)}</TableCell>
              <TableCell className="pr-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-neutral-500"
                      aria-label={`Actions for ${book.title}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onAdd(book)}>
                      <Plus className="size-4" />
                      Add stock
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onView(book)}>
                      <Eye className="size-4" />
                      View details
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

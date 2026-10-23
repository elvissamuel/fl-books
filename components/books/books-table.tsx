"use client";

import Link from "next/link";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { BookCover } from "@/components/books/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { BookPublicationStatus, CatalogBook } from "@/core/books/private-api";
import { formatNaira } from "@/core/dashboard/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-neutral-100 text-neutral-500",
  Draft: "bg-amber-50 text-amber-700",
  Archived: "bg-neutral-100 text-neutral-500",
};

const publicationLabels: Record<BookPublicationStatus, string> = {
  DRAFT: "Draft",
  AVAILABLE: "Active",
  NOT_AVAILABLE: "Inactive",
  ARCHIVED: "Archived",
};

function bookStatusLabel(book: CatalogBook) {
  if (book.status) return publicationLabels[book.status];
  if (typeof book.active === "boolean") return book.active ? "Active" : "Inactive";
  return "—";
}

export function BooksTable({
  books,
  selectedIds,
  onSelectedIdsChange,
  onEdit,
  onDelete,
}: {
  books: CatalogBook[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  onEdit: (book: CatalogBook) => void;
  onDelete: (book: CatalogBook) => void;
}) {
  const pageIds = books.map((book) => book.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const partiallySelected = selectedOnPage.length > 0 && !allSelected;

  function togglePage(checked: boolean) {
    if (checked) {
      onSelectedIdsChange([...new Set([...selectedIds, ...pageIds])]);
      return;
    }
    onSelectedIdsChange(selectedIds.filter((id) => !pageIds.includes(id)));
  }

  function toggleRow(id: string, checked: boolean) {
    onSelectedIdsChange(
      checked ? [...selectedIds, id] : selectedIds.filter((selected) => selected !== id),
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="h-11 w-12 pl-4">
              <Checkbox
                aria-label="Select all books on this page"
                checked={allSelected ? true : partiallySelected ? "indeterminate" : false}
                onCheckedChange={(checked) => togglePage(checked === true)}
              />
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">
              Product Details
            </TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Price</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Stocks</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">weight</TableHead>
            <TableHead className="h-11 text-xs font-medium text-neutral-500">Status</TableHead>
            <TableHead className="h-11 pr-4 text-xs font-medium text-neutral-500">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="py-12 text-center text-sm text-neutral-500">
                No books found.
              </TableCell>
            </TableRow>
          ) : null}
          {books.map((book) => (
            <TableRow key={book.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-3.5 pl-4">
                <Checkbox
                  aria-label={`Select ${book.title}`}
                  checked={selectedIds.includes(book.id)}
                  onCheckedChange={(checked) => toggleRow(book.id, checked === true)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 py-1">
                  <BookCover src={book.coverImageUrls[0] ?? null} title={book.title} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{book.title}</p>
                    <p className="text-xs text-neutral-500">{book.authorName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-neutral-700 tabular-nums">
                {formatNaira(book.price)}
              </TableCell>
              <TableCell className="text-sm text-neutral-700 tabular-nums">{book.stockQuantity}</TableCell>
              <TableCell className="text-sm text-neutral-700">
                {formatWeightFromGrams(book.weightInGrams)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full border-0 px-2.5 font-medium",
                    statusStyles[bookStatusLabel(book)],
                  )}
                >
                  {bookStatusLabel(book)}
                </Badge>
              </TableCell>
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
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/books/${book.id}`}>View book</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(book)}>
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(book)}>
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

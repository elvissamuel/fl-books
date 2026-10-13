"use client";

import { MoreVertical } from "lucide-react";
import { CountryFlag } from "@/components/dashboard/country-flag";
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
import type { PickupStation, PickupStationStatus } from "@/core/pickup-stations/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<PickupStationStatus, string> = {
  active: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  inactive: "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
};

const statusLabels: Record<PickupStationStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

const headings = [
  "Country",
  "Address",
  "City",
  "State",
  "Delivery Fee",
  "Contact",
  "Status",
  "Action",
];

export function PickupStationsTable({ stations }: { stations: PickupStation[] }) {
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
          {stations.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="py-12 text-center text-sm text-neutral-500">
                No locations found.
              </TableCell>
            </TableRow>
          ) : null}
          {stations.map((station) => (
            <TableRow key={station.id} className="border-neutral-100 hover:bg-neutral-50/70">
              <TableCell className="py-4 pl-5">
                <span className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <CountryFlag code="NG" />
                  {station.country}
                </span>
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{station.address}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{station.city}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{station.state}</TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">
                {station.deliveryFeeLabel}
              </TableCell>
              <TableCell className="py-4 text-sm text-neutral-700">{station.contact}</TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-6 rounded-full px-2.5 text-xs font-medium",
                    statusStyles[station.status],
                  )}
                >
                  {statusLabels[station.status]}
                </Badge>
              </TableCell>
              <TableCell className="py-4 pr-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-neutral-400"
                  aria-label={`Actions for ${station.address}`}
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

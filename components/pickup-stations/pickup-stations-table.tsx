"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CountryFlag } from "@/components/dashboard/country-flag";
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
import type { ShippingCountry } from "@/core/dashboard/types";
import type { PickupLocation, PickupLocationStatus } from "@/core/pickup-stations/private-api";
import { cn } from "@/lib/utils";

const statusStyles: Record<PickupLocationStatus, string> = {
  ACTIVE: "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]",
  INACTIVE: "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
};

const countryCodes: Record<string, ShippingCountry["code"]> = {
  Nigeria: "NG",
  Ghana: "GH",
  "United States": "US",
  Canada: "CA",
};

const headings = ["Country", "Location", "Address", "City", "State", "Contact", "Status", "Action"];

export function PickupStationsTable({
  stations,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: {
  stations: PickupLocation[];
  onView: (station: PickupLocation) => void;
  onEdit: (station: PickupLocation) => void;
  onActivate: (station: PickupLocation) => void;
  onDeactivate: (station: PickupLocation) => void;
  onDelete: (station: PickupLocation) => void;
}) {
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
          {stations.map((station) => {
            const flag = countryCodes[station.country];
            return (
              <TableRow key={station.id} className="border-neutral-100 hover:bg-neutral-50/70">
                <TableCell className="py-4 pl-5">
                  <span className="inline-flex items-center gap-2 text-sm text-neutral-700">
                    {flag ? <CountryFlag code={flag} /> : null}
                    {station.country}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-sm text-neutral-700">{station.locationName}</TableCell>
                <TableCell className="max-w-[220px] py-4 text-sm text-neutral-700">
                  {station.fullAddress}
                </TableCell>
                <TableCell className="py-4 text-sm text-neutral-700">{station.city}</TableCell>
                <TableCell className="py-4 text-sm text-neutral-700">{station.state}</TableCell>
                <TableCell className="py-4 text-sm text-neutral-700">
                  <span className="block">{station.contactName}</span>
                  <span className="text-xs text-neutral-400">{station.phoneNumber}</span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 rounded-full px-2.5 text-xs font-medium",
                      statusStyles[station.status],
                    )}
                  >
                    {station.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-neutral-400"
                        aria-label={`Actions for ${station.locationName}`}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(station)}>View location</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onEdit(station)}>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      {station.status === "ACTIVE" ? (
                        <DropdownMenuItem onSelect={() => onDeactivate(station)}>
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onSelect={() => onActivate(station)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(station)}>
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

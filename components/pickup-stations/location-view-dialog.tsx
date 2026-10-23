"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PickupLocation } from "@/core/pickup-stations/private-api";
import { usePrivatePickupLocation } from "@/features/pickup-stations/use-pickup-stations";
import { cn } from "@/lib/utils";

export function LocationViewDialog({
  locationId,
  onClose,
}: {
  locationId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const location = usePrivatePickupLocation(locationId);

  useEffect(() => {
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20 motion-safe:animate-[book-scrim-in_320ms_ease-out_both]"
        aria-label="Close location"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white px-6 pt-5 pb-6 shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none motion-safe:animate-[book-success-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
            {location.data?.locationName ?? "View location"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-700 hover:text-neutral-950"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {location.isLoading ? <p className="text-sm text-neutral-500">Loading location…</p> : null}
        {location.error instanceof Error ? (
          <p className="text-sm text-danger">{location.error.message}</p>
        ) : null}
        {location.data ? <LocationDetails location={location.data} /> : null}

        <Button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover"
        >
          Close
        </Button>
      </section>
    </div>
  );
}

function LocationDetails({ location }: { location: PickupLocation }) {
  return (
    <dl>
      <Detail label="Location name" value={location.locationName} />
      <Detail label="Full address" value={location.fullAddress} />
      <Detail label="City" value={location.city} />
      <Detail label="State" value={location.state} />
      <Detail label="Country" value={location.country} />
      <Detail label="Contact name" value={location.contactName} />
      <Detail label="Phone number" value={location.phoneNumber} />
      <Detail label="Email address" value={location.emailAddress} />
      <div className="flex items-center justify-between gap-6 border-b border-neutral-100 py-3">
        <dt className="text-sm text-neutral-500">Status</dt>
        <dd>
          <Badge
            variant="outline"
            className={cn(
              "h-6 rounded-full px-2.5 text-xs font-medium",
              location.status === "ACTIVE"
                ? "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]"
                : "border-[#f5c2c2] bg-[#fff6f6] text-[#e35d6a]",
            )}
          >
            {location.status === "ACTIVE" ? "Active" : "Inactive"}
          </Badge>
        </dd>
      </div>
    </dl>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-neutral-100 py-3 last:border-b-0">
      <dt className="shrink-0 text-sm text-neutral-500">{label}</dt>
      <dd className="text-right text-sm break-all text-neutral-900">{value}</dd>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminCustomer } from "@/core/customers/admin-api";
import { useAdminCustomer } from "@/features/customers/use-admin-customers";
import { cn } from "@/lib/utils";

function displayName(customer: AdminCustomer) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return name || customer.emailAddress;
}

function initials(customer: AdminCustomer) {
  const parts = [customer.firstName, customer.lastName].filter((part): part is string => Boolean(part));
  if (parts.length === 0) return customer.emailAddress.slice(0, 2).toUpperCase();
  return parts
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function genderLabel(customer: AdminCustomer) {
  if (customer.gender === "MALE") return "Male";
  if (customer.gender === "FEMALE") return "Female";
  return "—";
}

export function CustomerViewPanel({
  customerId,
  onClose,
}: {
  customerId: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const customer = useAdminCustomer(customerId);

  useEffect(() => {
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const profile = customer.data;

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20 motion-safe:animate-[book-scrim-in_480ms_ease-out_both]"
        aria-label="Close customer"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-3 right-3 flex w-[min(100%-1.5rem,560px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.16)] outline-none motion-safe:animate-[book-panel-in_520ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-neutral-950"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-5">
          {customer.isLoading ? <p className="text-sm text-neutral-500">Loading customer…</p> : null}
          {customer.error instanceof Error ? (
            <p className="text-sm text-danger">{customer.error.message}</p>
          ) : null}
          {profile ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-500">
                  {initials(profile)}
                </span>
                <div className="min-w-0">
                  <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
                    {displayName(profile)}
                  </h2>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span>{profile.customerNumber}</span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" strokeWidth={1.75} />
                      {profile.phoneNumber || "—"}
                    </span>
                  </p>
                </div>
              </div>

              <section className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-neutral-200 px-4 py-4">
                <Detail icon={<Mail className="mt-0.5 size-4 shrink-0 text-neutral-400" />} label="Email Address" value={profile.emailAddress} />
                <Detail label="Gender" value={genderLabel(profile)} />
                <Detail label="Date of birth" value={profile.dateOfBirth || "—"} />
                <Detail label="Phone" value={profile.phoneNumber || "—"} />
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 rounded-full px-2.5 text-xs font-medium",
                      profile.active
                        ? "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]"
                        : "border-neutral-200 bg-[#f7f7f8] text-neutral-400",
                    )}
                  >
                    {profile.active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 rounded-full px-2.5 text-xs font-medium",
                      profile.verified
                        ? "border-[#b7e4c7] bg-[#f3fbf6] text-[#3caf6e]"
                        : "border-neutral-200 bg-[#f7f7f8] text-neutral-400",
                    )}
                  >
                    {profile.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <Detail
                  label="Marketing emails"
                  value={profile.marketingEmailsEnabled ? "Enabled" : "Disabled"}
                />
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-neutral-400">{label}</p>
        <p className="mt-0.5 truncate text-sm text-neutral-800">{value}</p>
      </div>
    </div>
  );
}

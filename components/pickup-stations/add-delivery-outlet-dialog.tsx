"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { CountryFlag } from "@/components/dashboard/country-flag";
import type { ShippingCountry } from "@/core/dashboard/types";
import type { CreateDeliveryOutletPayload } from "@/core/pickup-stations/types";
import { useCreateDeliveryOutlet } from "@/features/pickup-stations/use-pickup-stations";
import { cn } from "@/lib/utils";

type CountryCode = ShippingCountry["code"];

type WeightRange = {
  id: string;
  minKg: string;
  maxKg: string;
  price: string;
};

const countries: { code: CountryCode; name: string }[] = [
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
];

const statuses = ["Active", "Inactive"] as const;

const controlClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

function blankRange(id: string): WeightRange {
  return { id, minKg: "00.0", maxKg: "00.0", price: "00.0" };
}

function formatDecimal(value: number) {
  const safe = Math.max(0, Math.round(value * 10) / 10);
  const [whole, fraction] = safe.toFixed(1).split(".");
  return `${whole.padStart(2, "0")}.${fraction}`;
}

export function AddDeliveryOutletDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const nextRangeId = useRef(2);
  const createOutlet = useCreateDeliveryOutlet();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState<CountryCode>("NG");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("Active");
  const [ranges, setRanges] = useState<WeightRange[]>(() => [blankRange("1")]);
  const [openMenu, setOpenMenu] = useState<"country" | "status" | null>(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  function updateRange(id: string, field: keyof Omit<WeightRange, "id">, value: string) {
    setRanges((current) =>
      current.map((range) => (range.id === id ? { ...range, [field]: value } : range)),
    );
  }

  function addRange() {
    const id = String(nextRangeId.current);
    nextRangeId.current += 1;
    setRanges((current) => [...current, blankRange(id)]);
  }

  const selectedCountry = countries.find((option) => option.code === country) ?? countries[0];

  function buildPayload(): CreateDeliveryOutletPayload {
    return {
      name,
      address,
      city,
      state: stateName,
      country: selectedCountry.name,
      contactName,
      phone,
      email,
      status: status === "Active" ? "active" : "inactive",
      weightRanges: ranges.map((range, index) => ({
        serialNumber: index + 1,
        minKg: Number.parseFloat(range.minKg) || 0,
        maxKg: Number.parseFloat(range.maxKg) || 0,
        price: Number.parseFloat(range.price) || 0,
      })),
    };
  }

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/[0.04] motion-safe:animate-[book-scrim-in_480ms_ease-out_both]"
        aria-label="Close add delivery outlet"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-3 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.14)] outline-none motion-safe:animate-[book-panel-in_520ms_cubic-bezier(0.16,1,0.3,1)_both] min-[1200px]:left-[248px]"
      >
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
            Add Delivery Outlet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <form
          className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-6 pt-4 pb-8"
          onSubmit={(event) => {
            event.preventDefault();
            createOutlet.mutate(buildPayload(), { onSuccess: onSaved });
          }}
        >
          <Field id="outlet-name" label="Delivery Outlet Name">
            <input
              id="outlet-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Location name"
              autoComplete="off"
              className={controlClass}
            />
          </Field>

          <Field id="outlet-address" label="Full Address">
            <input
              id="outlet-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Location name"
              autoComplete="off"
              className={controlClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field id="outlet-city" label="City">
              <input
                id="outlet-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="e.g Port harcourt"
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="outlet-state" label="State">
              <input
                id="outlet-state"
                value={stateName}
                onChange={(event) => setStateName(event.target.value)}
                placeholder="e.g Rivers Sate"
                autoComplete="off"
                className={controlClass}
              />
            </Field>
          </div>

          <Field id="outlet-country" label="Country">
            <div className="relative">
              <button
                id="outlet-country"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={openMenu === "country"}
                onClick={() => setOpenMenu((current) => (current === "country" ? null : "country"))}
                className={cn(controlClass, "flex items-center gap-2 text-left")}
              >
                <CountryFlag code={selectedCountry.code} />
                <span className="flex-1">{selectedCountry.name}</span>
                <ChevronDown className="size-4 text-neutral-400" />
              </button>
              {openMenu === "country" ? (
                <ul
                  role="listbox"
                  aria-label="Country"
                  className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
                >
                  {countries.map((option) => (
                    <li key={option.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={option.code === country}
                        onClick={() => {
                          setCountry(option.code);
                          setOpenMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-50"
                      >
                        <CountryFlag code={option.code} />
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Field>

          <h3 className="pt-1 text-[15px] font-semibold text-neutral-950">Contact information</h3>

          <div className="grid grid-cols-2 gap-3">
            <Field id="outlet-contact" label="Contact Name">
              <input
                id="outlet-contact"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="outlet-phone" label="Phone number">
              <input
                id="outlet-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g 08107355412"
                autoComplete="off"
                inputMode="tel"
                className={controlClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field id="outlet-email" label="Email address">
              <input
                id="outlet-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g example@gmail.com"
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="outlet-status" label="Availability status">
              <div className="relative">
                <button
                  id="outlet-status"
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === "status"}
                  onClick={() => setOpenMenu((current) => (current === "status" ? null : "status"))}
                  className={cn(controlClass, "flex items-center justify-between text-left")}
                >
                  <span>{status}</span>
                  <ChevronDown className="size-4 text-neutral-400" />
                </button>
                {openMenu === "status" ? (
                  <ul
                    role="listbox"
                    aria-label="Availability status"
                    className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
                  >
                    {statuses.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={option === status}
                          onClick={() => {
                            setStatus(option);
                            setOpenMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-50"
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Field>
          </div>

          <div className="flex items-center justify-between pt-1">
            <h3 className="text-[15px] font-semibold text-neutral-950">Tiered Weight Pricing</h3>
            <button
              type="button"
              onClick={addRange}
              className="text-[13px] font-medium text-[#3caf6e] hover:text-[#2f9a60]"
            >
              Add New Range
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <div className="grid grid-cols-[52px_1fr_1fr_1.2fr] items-center gap-2 bg-[#f6f6f6] px-3 py-2.5">
              <HeaderLabel label="S/N" />
              <HeaderLabel label="Min kg" />
              <HeaderLabel label="Max kg" />
              <HeaderLabel label="Price (N NGN)" />
            </div>
            <div className="flex flex-col gap-2 px-3 py-3">
              {ranges.map((range, index) => (
                <div
                  key={range.id}
                  className="grid grid-cols-[52px_1fr_1fr_1.2fr] items-center gap-2"
                >
                  <span className="text-sm text-neutral-700">#{index + 1}</span>
                  <DecimalField
                    label={`Minimum kg for range ${index + 1}`}
                    value={range.minKg}
                    onChange={(value) => updateRange(range.id, "minKg", value)}
                  />
                  <DecimalField
                    label={`Maximum kg for range ${index + 1}`}
                    value={range.maxKg}
                    onChange={(value) => updateRange(range.id, "maxKg", value)}
                  />
                  <DecimalField
                    label={`Price for range ${index + 1}`}
                    value={range.price}
                    onChange={(value) => updateRange(range.id, "price", value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={createOutlet.isPending}
            className="h-12 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            Save Location
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-neutral-800">
        {label}
        <span className="text-[#e11d48]">*</span>
      </label>
      {children}
    </div>
  );
}

function HeaderLabel({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-medium whitespace-nowrap text-neutral-500">
      {label}
      <span className="text-[#e11d48]">*</span>
    </span>
  );
}

function DecimalField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  function step(delta: number) {
    const current = Number.parseFloat(value);
    const base = Number.isFinite(current) ? current : 0;
    onChange(formatDecimal(base + delta));
  }

  return (
    <div className="flex h-9 items-center rounded-lg border border-neutral-200 bg-white pr-0.5 pl-2">
      <input
        aria-label={label}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(sanitizeDecimal(event.target.value))}
        onBlur={() => {
          const current = Number.parseFloat(value);
          onChange(formatDecimal(Number.isFinite(current) ? current : 0));
        }}
        className="w-full min-w-0 bg-transparent text-[13px] text-neutral-800 outline-none"
      />
      <div className="flex shrink-0 flex-col text-neutral-800">
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => step(0.1)}
          className="flex h-3.5 items-center justify-center px-0.5"
        >
          <ChevronUp className="size-3" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => step(-0.1)}
          className="flex h-3.5 items-center justify-center px-0.5"
        >
          <ChevronDown className="size-3" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function sanitizeDecimal(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join("").slice(0, 1)}`;
}

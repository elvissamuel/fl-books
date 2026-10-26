"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import type {
  PickupLocation,
  PickupLocationStatus,
  UpdatePickupLocationRequest,
} from "@/core/pickup-stations/private-api";
import {
  useCreatePrivatePickupLocation,
  useUpdatePrivatePickupLocation,
} from "@/features/pickup-stations/use-pickup-stations";

const controlClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function PickupLocationDialog({
  location,
  onClose,
  onSaved,
}: {
  location?: PickupLocation;
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const editing = Boolean(location);
  const createLocation = useCreatePrivatePickupLocation();
  const updateLocation = useUpdatePrivatePickupLocation();
  const pending = createLocation.isPending || updateLocation.isPending;
  const [formError, setFormError] = useState("");
  const [locationName, setLocationName] = useState(location?.locationName ?? "");
  const [fullAddress, setFullAddress] = useState(location?.fullAddress ?? "");
  const [city, setCity] = useState(location?.city ?? "");
  const [stateName, setStateName] = useState(location?.state ?? "");
  const [country, setCountry] = useState(location?.country ?? "");
  const [contactName, setContactName] = useState(location?.contactName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(location?.phoneNumber ?? "");
  const [emailAddress, setEmailAddress] = useState(location?.emailAddress ?? "");
  const [status, setStatus] = useState<PickupLocationStatus>(location?.status ?? "ACTIVE");

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

  function saveLocation() {
    const request = buildRequest();
    if (typeof request === "string") {
      setFormError(request);
      return;
    }
    setFormError("");
    const options = {
      onSuccess: onSaved,
      onError: (error: Error) => setFormError(error.message),
    };
    if (editing && location) {
      updateLocation.mutate({ locationId: location.id, request }, options);
      return;
    }
    createLocation.mutate(request, options);
  }

  function buildRequest(): UpdatePickupLocationRequest | string {
    if (!locationName.trim() || !fullAddress.trim() || !city.trim() || !stateName.trim() || !country.trim()) {
      return "Name, address, city, state, and country are required.";
    }
    if (!contactName.trim() || !phoneNumber.trim() || !emailAddress.trim()) {
      return "Contact name, phone number, and email are required.";
    }
    return {
      locationName: locationName.trim(),
      fullAddress: fullAddress.trim(),
      city: city.trim(),
      state: stateName.trim(),
      country: country.trim(),
      contactName: contactName.trim(),
      phoneNumber: phoneNumber.trim(),
      emailAddress: emailAddress.trim(),
      status,
    };
  }

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/[0.04] motion-safe:animate-[book-scrim-in_480ms_ease-out_both]"
        aria-label="Close pickup location"
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
            {editing ? "Edit pickup location" : "Add pickup location"}
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
            saveLocation();
          }}
        >
          {formError ? <p className="text-sm text-danger">{formError}</p> : null}
          <Field id="location-name" label="Location name">
            <input id="location-name" value={locationName} onChange={(event) => setLocationName(event.target.value)} className={controlClass} />
          </Field>
          <Field id="location-address" label="Full address">
            <input id="location-address" value={fullAddress} onChange={(event) => setFullAddress(event.target.value)} className={controlClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="location-city" label="City">
              <input id="location-city" value={city} onChange={(event) => setCity(event.target.value)} className={controlClass} />
            </Field>
            <Field id="location-state" label="State">
              <input id="location-state" value={stateName} onChange={(event) => setStateName(event.target.value)} className={controlClass} />
            </Field>
          </div>
          <Field id="location-country" label="Country">
            <input id="location-country" value={country} onChange={(event) => setCountry(event.target.value)} className={controlClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="location-contact" label="Contact name">
              <input id="location-contact" value={contactName} onChange={(event) => setContactName(event.target.value)} className={controlClass} />
            </Field>
            <Field id="location-phone" label="Phone number">
              <input id="location-phone" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} className={controlClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="location-email" label="Email address">
              <input id="location-email" type="email" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} className={controlClass} />
            </Field>
            <Field id="location-status" label="Status">
              <select
                id="location-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as PickupLocationStatus)}
                className={controlClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save Location"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
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

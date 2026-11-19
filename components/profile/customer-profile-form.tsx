"use client";

import { useState, type ReactNode } from "react";
import type { CustomerGender } from "@/core/customers/public-api";
import type { CustomerProfile } from "@/core/customers/private-api";
import { toast } from "@/components/ui/toaster";
import { updateOwnCustomerProfile } from "@/infrastructure/customers/private-customers-actions";

const fieldClass =
  "h-11 w-full rounded-lg border border-[#e6e8ee] bg-white px-3 text-[14px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf] focus:border-brand";

function dateValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function CustomerProfileForm({ profile }: { profile: CustomerProfile }) {
  const [firstName, setFirstName] = useState(profile.firstName ?? "");
  const [lastName, setLastName] = useState(profile.lastName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(dateValue(profile.dateOfBirth));
  const [gender, setGender] = useState<CustomerGender | "">(profile.gender ?? "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile.profilePictureUrl ?? "");
  const [marketingEmailsEnabled, setMarketingEmailsEnabled] = useState(profile.marketingEmailsEnabled);
  const [country, setCountry] = useState(profile.address?.country ?? "");
  const [state, setState] = useState(profile.address?.state ?? "");
  const [city, setCity] = useState(profile.address?.city ?? "");
  const [addressLine, setAddressLine] = useState(profile.address?.addressLine ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !dateOfBirth || !gender) {
      setMessage("Enter your name, phone, date of birth, and gender.");
      return;
    }
    if (!country.trim() || !state.trim() || !city.trim() || !addressLine.trim()) {
      setMessage("Enter your country, state, city, and address.");
      return;
    }

    setPending(true);
    setMessage("");
    const result = await updateOwnCustomerProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      dateOfBirth,
      gender,
      profilePictureUrl: profilePictureUrl.trim(),
      marketingEmailsEnabled,
      address: {
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        addressLine: addressLine.trim(),
      },
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.sessionExpired ? "Sign in again to update your profile." : result.message);
      return;
    }
    const next = result.data;
    setFirstName(next.firstName ?? "");
    setLastName(next.lastName ?? "");
    setPhoneNumber(next.phoneNumber ?? "");
    setDateOfBirth(dateValue(next.dateOfBirth));
    setGender(next.gender ?? "");
    setProfilePictureUrl(next.profilePictureUrl ?? "");
    setMarketingEmailsEnabled(next.marketingEmailsEnabled);
    setCountry(next.address?.country ?? "");
    setState(next.address?.state ?? "");
    setCity(next.address?.city ?? "");
    setAddressLine(next.address?.addressLine ?? "");
    toast.success(result.message || "Profile updated.");
  }

  return (
    <form
      className="mt-6 rounded-[18px] border border-[#eceef3] bg-white p-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-[13px] text-[#8d939c]">Email</dt>
          <dd className="mt-1 text-[16px] text-[#1c1f24]">{profile.emailAddress}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-[#8d939c]">Customer number</dt>
          <dd className="mt-1 text-[16px] text-[#1c1f24]">{profile.customerNumber}</dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className={fieldClass} />
        </Field>
        <Field label="Last name">
          <input value={lastName} onChange={(event) => setLastName(event.target.value)} className={fieldClass} />
        </Field>
        <Field label="Phone number">
          <input
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            inputMode="tel"
            className={fieldClass}
          />
        </Field>
        <Field label="Date of birth">
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Gender">
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as CustomerGender | "")}
            className={fieldClass}
          >
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </Field>
        <Field label="Profile picture URL">
          <input
            value={profilePictureUrl}
            onChange={(event) => setProfilePictureUrl(event.target.value)}
            placeholder="https://"
            className={fieldClass}
          />
        </Field>
        <Field label="Country">
          <input value={country} onChange={(event) => setCountry(event.target.value)} className={fieldClass} />
        </Field>
        <Field label="State">
          <input value={state} onChange={(event) => setState(event.target.value)} className={fieldClass} />
        </Field>
        <Field label="City">
          <input value={city} onChange={(event) => setCity(event.target.value)} className={fieldClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <input
              value={addressLine}
              onChange={(event) => setAddressLine(event.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>
      </div>

      <label className="mt-5 flex items-center gap-2 text-[14px] text-[#1c1f24]">
        <input
          type="checkbox"
          checked={marketingEmailsEnabled}
          onChange={(event) => setMarketingEmailsEnabled(event.target.checked)}
          className="size-4 rounded border border-[#cfd3da] accent-brand"
        />
        Send me marketing emails
      </label>

      {message ? <p className="mt-4 text-[14px] text-danger">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand text-[14px] font-medium text-white hover:bg-brand-hover disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#1c1f24]">{label}</span>
      {children}
    </label>
  );
}

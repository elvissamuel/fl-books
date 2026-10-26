"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { AdminProfile } from "@/core/platform-settings/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-lg bg-[#f4f5f6] px-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-400";

export function AdminProfilePanel({
  profile,
  onChange,
}: {
  profile: AdminProfile;
  onChange: (profile: AdminProfile) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pictureError, setPictureError] = useState("");

  function choosePicture(file: File | undefined) {
    if (!file) return;
    const allowed = file.type === "image/jpeg" || file.type === "image/png";
    if (!allowed || file.size > 10 * 1024 * 1024) {
      setPictureError("Use a JPG or PNG up to 10mb.");
      return;
    }
    setPictureError("");
    onChange({ ...profile, imageUrl: URL.createObjectURL(file) });
  }

  return (
    <div>
      <h2 className="text-[15px] font-semibold text-neutral-950">Admin Information</h2>
      <div className="relative mt-4 h-[4.75rem]">
        <Image
          src={profile.imageUrl}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="size-16 rounded-full object-cover"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute top-4 left-11 z-10 h-6 rounded-full bg-brand px-2.5 text-[10px] font-medium text-white"
        >
          Change Picture
        </button>
        <p className="absolute top-11 left-16 text-[10px] whitespace-nowrap text-neutral-400">
          JPG or PNG 10mb
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(event) => choosePicture(event.target.files?.[0])}
        />
      </div>
      {pictureError ? <p className="mt-2 text-sm text-danger">{pictureError}</p> : null}

      <div className="mt-5 space-y-4">
        <Field label="First Name">
          <input
            value={profile.firstName}
            onChange={(event) => onChange({ ...profile, firstName: event.target.value })}
            placeholder="Type Here"
            autoComplete="given-name"
            className={fieldClass}
          />
        </Field>
        <Field label="Last Name">
          <input
            value={profile.lastName}
            onChange={(event) => onChange({ ...profile, lastName: event.target.value })}
            placeholder="Type Here"
            autoComplete="family-name"
            className={fieldClass}
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            value={profile.email}
            onChange={(event) => onChange({ ...profile, email: event.target.value })}
            placeholder="Type Here"
            autoComplete="email"
            className={fieldClass}
          />
        </Field>
        <Field label="Phone Number">
          <input
            value={profile.phone}
            onChange={(event) => onChange({ ...profile, phone: event.target.value })}
            placeholder="Type Here"
            autoComplete="tel"
            className={fieldClass}
          />
        </Field>
      </div>

      <h2 className="mt-6 text-[15px] font-semibold text-neutral-950">Notification Preference</h2>
      <div className="mt-3 space-y-3">
        <Preference
          title="In App Notifications"
          description="Receive notification in app"
          checked={profile.inAppNotifications}
          onChange={(inAppNotifications) => onChange({ ...profile, inAppNotifications })}
        />
        <Preference
          title="Email Notifications"
          description="Receive notification via email"
          checked={profile.emailNotifications}
          onChange={(emailNotifications) => onChange({ ...profile, emailNotifications })}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-neutral-900">{label}</span>
      {children}
    </label>
  );
}

function Preference({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f6f7f8] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-neutral-950">{title}</p>
        <p className="text-xs text-neutral-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-neutral-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all",
            checked ? "left-5" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

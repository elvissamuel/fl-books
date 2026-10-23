"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminGender, AdminPermission } from "@/core/auth/admin-api";
import {
  useAdminAccount,
  useCreateAdminAccount,
  useUpdateAdminAccount,
} from "@/features/auth/use-admin-auth";
import { cn } from "@/lib/utils";

const permissionGroups: { label: string; items: { id: AdminPermission; label: string }[] }[] = [
  {
    label: "Books",
    items: [
      { id: "BOOK_CREATE", label: "Create" },
      { id: "BOOK_VIEW", label: "View" },
      { id: "BOOK_UPDATE", label: "Update" },
      { id: "BOOK_DELETE", label: "Delete" },
    ],
  },
  {
    label: "Customers",
    items: [
      { id: "CUSTOMER_VIEW", label: "View" },
      { id: "CUSTOMER_UPDATE", label: "Update" },
      { id: "CUSTOMER_DELETE", label: "Delete" },
    ],
  },
  {
    label: "Currency",
    items: [
      { id: "CURRENCY_CREATE", label: "Create" },
      { id: "CURRENCY_VIEW", label: "View" },
      { id: "CURRENCY_UPDATE", label: "Update" },
      { id: "CURRENCY_DELETE", label: "Delete" },
    ],
  },
  {
    label: "Distance bands",
    items: [
      { id: "DISTANCE_BAND_CREATE", label: "Create" },
      { id: "DISTANCE_BAND_VIEW", label: "View" },
      { id: "DISTANCE_BAND_UPDATE", label: "Update" },
      { id: "DISTANCE_BAND_DELETE", label: "Delete" },
    ],
  },
  {
    label: "Platform settings",
    items: [
      { id: "PLATFORM_SETTINGS_CREATE", label: "Create" },
      { id: "PLATFORM_SETTINGS_VIEW", label: "View" },
      { id: "PLATFORM_SETTINGS_UPDATE", label: "Update" },
      { id: "PLATFORM_SETTINGS_DELETE", label: "Delete" },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "ADMIN_CREATE", label: "Create" },
      { id: "ADMIN_VIEW", label: "View" },
      { id: "ADMIN_UPDATE", label: "Update" },
      { id: "ADMIN_DELETE", label: "Delete" },
    ],
  },
  {
    label: "Activity log",
    items: [{ id: "ACTIVITY_LOG_VIEW", label: "View" }],
  },
];

const controlClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function AdminAccountDialog({
  mode,
  adminId = "",
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  adminId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const createAdmin = useCreateAdminAccount();
  const updateAdmin = useUpdateAdminAccount();
  const account = useAdminAccount(mode === "edit" ? adminId : "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [profileColourCode, setProfileColourCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<AdminGender>("MALE");
  const [active, setActive] = useState(true);
  const [selected, setSelected] = useState<AdminPermission[]>([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const current = account.data;
    if (!current) return;
    setFirstName(current.firstName ?? "");
    setLastName(current.lastName ?? "");
    setPhoneNumber(current.phoneNumber ?? "");
    setProfilePictureUrl(current.profilePictureUrl ?? "");
    setDateOfBirth(current.dateOfBirth?.slice(0, 10) ?? "");
    setGender(current.gender ?? "MALE");
    setSelected((current.permissions ?? []).flatMap((group) => group.permissions));
  }, [account.data]);

  const pending = createAdmin.isPending || updateAdmin.isPending;
  const loadError = mode === "edit" && account.error instanceof Error ? account.error.message : "";

  function togglePermission(id: AdminPermission, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((permission) => permission !== id),
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20 motion-safe:animate-[book-scrim-in_320ms_ease-out_both]"
        aria-label="Close admin form"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[720px] overflow-y-auto rounded-2xl bg-white px-6 pt-5 pb-6 shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none motion-safe:animate-[book-success-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
            {mode === "create" ? "Add new admin" : "Edit admin"}
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

        {loadError ? <p className="mb-4 text-sm text-danger">{loadError}</p> : null}

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setFormError("");
            const permissions = selected;
            if (mode === "create") {
              createAdmin.mutate(
                {
                  firstName,
                  lastName,
                  emailAddress,
                  password,
                  phoneNumber,
                  profilePictureUrl,
                  profileColourCode,
                  gender,
                  active,
                  permissions,
                },
                {
                  onSuccess: onSaved,
                  onError: (error) => setFormError(error.message),
                },
              );
              return;
            }

            updateAdmin.mutate(
              {
                adminId,
                request: {
                  firstName,
                  lastName,
                  phoneNumber,
                  profilePictureUrl,
                  dateOfBirth,
                  gender,
                  permissions,
                },
              },
              {
                onSuccess: onSaved,
                onError: (error) => setFormError(error.message),
              },
            );
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="admin-first-name" label="First name">
              <input
                id="admin-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="admin-last-name" label="Last name">
              <input
                id="admin-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            {mode === "create" ? (
              <>
                <Field id="admin-email" label="Email">
                  <input
                    id="admin-email"
                    type="email"
                    value={emailAddress}
                    onChange={(event) => setEmailAddress(event.target.value)}
                    placeholder="Enter email"
                    required
                    autoComplete="off"
                    className={controlClass}
                  />
                </Field>
                <Field id="admin-password" label="Password">
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                    className={controlClass}
                  />
                </Field>
              </>
            ) : null}
            <Field id="admin-phone" label="Phone number">
              <input
                id="admin-phone"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="e.g 08107355412"
                required
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="admin-gender" label="Gender">
              <div className="relative">
                <select
                  id="admin-gender"
                  value={gender}
                  onChange={(event) => setGender(event.target.value as AdminGender)}
                  className={cn(controlClass, "appearance-none pr-9")}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-500" />
              </div>
            </Field>
            <Field id="admin-photo" label="Profile picture URL" required={false}>
              <input
                id="admin-photo"
                value={profilePictureUrl}
                onChange={(event) => setProfilePictureUrl(event.target.value)}
                placeholder="https://"
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            {mode === "create" ? (
              <Field id="admin-colour" label="Profile colour code" required={false}>
                <input
                  id="admin-colour"
                  value={profileColourCode}
                  onChange={(event) => setProfileColourCode(event.target.value)}
                  placeholder="#31564E"
                  autoComplete="off"
                  className={controlClass}
                />
              </Field>
            ) : (
              <Field id="admin-dob" label="Date of birth" required={false}>
                <input
                  id="admin-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className={controlClass}
                />
              </Field>
            )}
          </div>

          {mode === "create" ? (
            <Field id="admin-status" label="Status">
              <div className="relative">
                <select
                  id="admin-status"
                  value={active ? "true" : "false"}
                  onChange={(event) => setActive(event.target.value === "true")}
                  className={cn(controlClass, "appearance-none pr-9")}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-500" />
              </div>
            </Field>
          ) : null}

          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-900">Permissions</p>
            <div className="space-y-3">
              {permissionGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-xs font-medium text-neutral-500">{group.label}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {group.items.map((permission) => {
                      const checked = selected.includes(permission.id);
                      return (
                        <label
                          key={permission.id}
                          className="flex h-10 items-center justify-between rounded-lg border border-neutral-200 px-3 text-sm text-neutral-800"
                        >
                          {permission.label}
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => togglePermission(permission.id, value === true)}
                            aria-label={`${group.label} ${permission.label}`}
                            className="data-[state=unchecked]:border-[#e4e4e7] data-[state=unchecked]:bg-[#ececef]"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {formError ? <p className="text-sm text-danger">{formError}</p> : null}

          <button
            type="submit"
            disabled={pending || (mode === "edit" && account.isLoading)}
            className="h-12 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            Save Change
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  required = true,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-neutral-900">
        {label}
        {required ? <span className="text-[#e11d48]">*</span> : null}
      </label>
      {children}
    </div>
  );
}

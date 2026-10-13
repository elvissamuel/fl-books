"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminPermission, AdminStatus } from "@/core/administration/types";
import { useCreateStaffAdmin } from "@/features/administration/use-administration";
import { cn } from "@/lib/utils";

const permissions: { id: AdminPermission; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "books", label: "Books" },
  { id: "orders", label: "Orders" },
  { id: "customers", label: "Customers" },
  { id: "pickup-stations", label: "Pickup Stations" },
  { id: "administration", label: "Administration" },
  { id: "settings", label: "Settings" },
];

const defaultPermissions: AdminPermission[] = [
  "dashboard",
  "books",
  "orders",
  "pickup-stations",
  "administration",
];

const controlClass =
  "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function AddAdminDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const createAdmin = useCreateStaffAdmin();
  const [firstName, setFirstName] = useState("Dave");
  const [surname, setSurname] = useState("Joe");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password12");
  const [status, setStatus] = useState<AdminStatus>("active");
  const [selected, setSelected] = useState<AdminPermission[]>(defaultPermissions);

  useEffect(() => {
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
        aria-label="Close add new admin"
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white px-6 pt-5 pb-6 shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none motion-safe:animate-[book-success-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
            Add new admin
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

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createAdmin.mutate(
              {
                firstName,
                surname,
                email,
                password,
                status,
                permissions: permissions
                  .map((permission) => permission.id)
                  .filter((id) => selected.includes(id)),
              },
              { onSuccess: onSaved },
            );
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="admin-first-name" label="Add new user">
              <input
                id="admin-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="admin-surname" label="Surname">
              <input
                id="admin-surname"
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
                required
                autoComplete="off"
                className={controlClass}
              />
            </Field>
            <Field id="admin-email" label="Email">
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
          </div>

          <Field id="admin-status" label="Status">
            <div className="relative">
              <select
                id="admin-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as AdminStatus)}
                className={cn(controlClass, "appearance-none pr-9")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-500" />
            </div>
          </Field>

          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-900">Permissions</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {permissions.map((permission) => {
                const checked = selected.includes(permission.id);
                return (
                  <label
                    key={permission.id}
                    className="flex h-11 items-center justify-between rounded-lg border border-neutral-200 px-3 text-sm text-neutral-800"
                  >
                    {permission.label}
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => togglePermission(permission.id, value === true)}
                      aria-label={permission.label}
                      className="data-[state=unchecked]:border-[#e4e4e7] data-[state=unchecked]:bg-[#ececef]"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={createAdmin.isPending}
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
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-neutral-900">
        {label}
        <span className="text-[#e11d48]">*</span>
      </label>
      {children}
    </div>
  );
}

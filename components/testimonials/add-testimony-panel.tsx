"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useCreateTestimonial } from "@/features/testimonials/use-testimonials";

const controlClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

function readPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AddTestimonyPanel({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const createTestimonial = useCreateTestimonial();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    panelRef.current?.focus();
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

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }

    const preview = URL.createObjectURL(photo);
    setPhotoPreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [photo]);

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-40 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/[0.04] motion-safe:animate-[book-scrim-in_480ms_ease-out_both]"
        aria-label="Close add testimony"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-3 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(17,24,22,0.14)] outline-none motion-safe:animate-[book-panel-in_520ms_cubic-bezier(0.16,1,0.3,1)_both] min-[1200px]:left-[248px]"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-neutral-950">
            Add Testimony
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
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pt-4 pb-8"
          onSubmit={(event) => {
            event.preventDefault();
            const selected = photo;
            void (async () => {
              const photoDataUrl = selected ? await readPhoto(selected) : null;
              createTestimonial.mutate(
                { name, role, message, photoDataUrl },
                { onSuccess: onSaved },
              );
            })();
          }}
        >
          <div className="flex items-stretch gap-4">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="relative flex w-[118px] shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-[#f4f5f6] text-neutral-400"
            >
              {photoPreview ? (
                <Image src={photoPreview} alt="" fill unoptimized className="object-cover" />
              ) : (
                <>
                  <Plus className="size-4" strokeWidth={1.75} />
                  <span className="text-xs">Add photo</span>
                </>
              )}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Field id="testimony-name" label="Name">
                <input
                  id="testimony-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Type here"
                  required
                  autoComplete="off"
                  className={`${controlClass} h-10`}
                />
              </Field>
              <Field id="testimony-role" label="Role">
                <input
                  id="testimony-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Type here"
                  required
                  autoComplete="off"
                  className={`${controlClass} h-10`}
                />
              </Field>
            </div>
          </div>

          <Field id="testimony-message" label="Message">
            <textarea
              id="testimony-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type here"
              required
              rows={4}
              className={`${controlClass} min-h-[104px] resize-none py-2.5`}
            />
          </Field>

          <button
            type="submit"
            disabled={createTestimonial.isPending}
            className="h-12 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            Add Testimonial
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

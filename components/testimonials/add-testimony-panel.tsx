"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useUploadPrivateFile } from "@/features/files/use-files";
import type { PrivateTestimonial } from "@/core/testimonials/private-api";
import {
  useCreatePrivateTestimonial,
  useUpdatePrivateTestimonial,
} from "@/features/testimonials/use-testimonials";

const controlClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15";

export function AddTestimonyPanel({
  mode,
  testimonial,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  testimonial?: PrivateTestimonial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const createTestimonial = useCreatePrivateTestimonial();
  const updateTestimonial = useUpdatePrivateTestimonial();
  const uploadPhoto = useUploadPrivateFile();
  const [name, setName] = useState(testimonial?.name ?? "");
  const [role, setRole] = useState(testimonial?.role ?? "");
  const [message, setMessage] = useState(testimonial?.message ?? "");
  const [imageUrl, setImageUrl] = useState(testimonial?.imageUrl ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const pending =
    createTestimonial.isPending || updateTestimonial.isPending || uploadPhoto.isPending;

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

  async function saveTestimony() {
    setFormError("");
    try {
      let nextImageUrl = imageUrl;
      if (photo) {
        const uploaded = await uploadPhoto.mutateAsync({
          category: "PROFILE_PICTURE",
          file: photo,
        });
        if (!uploaded.fileUrl) throw new Error("Photo upload did not return a file URL.");
        nextImageUrl = uploaded.fileUrl;
      }

      const request = {
        name: name.trim(),
        role: role.trim(),
        message: message.trim(),
        imageUrl: nextImageUrl,
      };

      if (mode === "edit" && testimonial) {
        await updateTestimonial.mutateAsync({ testimonialId: testimonial.id, request });
      } else {
        await createTestimonial.mutateAsync(request);
      }
      onSaved();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Request failed.");
    }
  }

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
            {mode === "create" ? "Add Testimony" : "Edit Testimony"}
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
            void saveTestimony();
          }}
        >
          {formError ? <p className="text-sm text-danger">{formError}</p> : null}
          <div className="flex items-stretch gap-4">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="relative flex w-[118px] shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-[#f4f5f6] text-neutral-400"
            >
              {photoPreview || imageUrl ? (
                <Image
                  src={photoPreview ?? imageUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
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
            disabled={pending}
            className="h-12 w-full rounded-xl bg-brand text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : mode === "create" ? "Add Testimonial" : "Save changes"}
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

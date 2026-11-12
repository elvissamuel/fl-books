"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookCategory, BookCategoryWriteRequest } from "@/core/book-categories/category";
import { useUploadPrivateFile } from "@/features/files/use-files";

export function CategoryDialog({
  category,
  pending,
  onClose,
  onSave,
}: {
  category?: BookCategory;
  pending: boolean;
  onClose: () => void;
  onSave: (input: BookCategoryWriteRequest) => void | Promise<void>;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const uploadFile = useUploadPrivateFile();
  const [name, setName] = useState(category?.name ?? "");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const previewRef = useRef<string | null>(null);
  const busy = pending || uploadFile.isPending;

  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, busy]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function choosePhoto(file: File) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const next = URL.createObjectURL(file);
    previewRef.current = next;
    setPreview(next);
    setFormError("");
    void uploadPhoto(file);
  }

  async function uploadPhoto(file: File) {
    try {
      const uploaded = await uploadFile.mutateAsync({ category: "IMAGE", file });
      if (!uploaded.fileUrl) throw new Error("Cover upload did not return a file URL.");
      setImageUrl(uploaded.fileUrl);
    } catch (error) {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
      setPreview(null);
      setFormError(error instanceof Error ? error.message : "Cover upload failed.");
    }
  }

  async function saveCategory() {
    if (!name.trim()) {
      setFormError("Enter a category name.");
      return;
    }
    if (!imageUrl.trim()) {
      setFormError(uploadFile.isPending ? "Wait for the cover photo to finish uploading." : "Add a cover photo.");
      return;
    }
    setFormError("");
    try {
      await onSave({ name: name.trim(), imageUrl: imageUrl.trim() });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Request failed.");
    }
  }

  const photo = preview || imageUrl;

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/25"
        aria-label="Close category"
        onClick={() => {
          if (!busy) onClose();
        }}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-[440px] rounded-2xl bg-white px-6 pt-5 pb-6 shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id={titleId} className="text-[17px] font-semibold text-neutral-950">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <button
            type="button"
            className="text-neutral-700"
            aria-label="Close"
            disabled={busy}
            onClick={onClose}
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <label className="flex h-[118px] w-[104px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-neutral-200 text-neutral-400 hover:bg-neutral-50">
          {photo ? (
            <Image
              src={photo}
              alt=""
              width={104}
              height={118}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <Plus className="size-4" strokeWidth={1.75} />
              <span className="px-2 text-center text-xs text-neutral-500">
                {uploadFile.isPending ? "Uploading…" : "Add cover photo"}
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadFile.isPending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) choosePhoto(file);
            }}
          />
        </label>
        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-medium text-neutral-900">
            Category Name<span className="text-[#e11d48]">*</span>
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type here"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </label>
        {formError ? <p className="mt-3 text-sm text-danger">{formError}</p> : null}
        <Button
          type="button"
          disabled={busy}
          onClick={saveCategory}
          className="mt-5 h-11 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover"
        >
          {busy ? "Saving..." : category ? "Save changes" : "Add Category"}
        </Button>
      </section>
    </div>
  );
}

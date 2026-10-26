"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";

export function CustomerStatusDialog({
  name,
  action,
  pending,
  onClose,
  onConfirm,
}: {
  name: string;
  action: "activate" | "deactivate";
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const activating = action === "activate";

  useEffect(() => {
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pending]);

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20 motion-safe:animate-[book-scrim-in_320ms_ease-out_both]"
        aria-label="Close confirmation"
        onClick={() => {
          if (!pending) onClose();
        }}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-w-[400px] rounded-2xl bg-white px-7 pt-7 pb-6 text-center shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none motion-safe:animate-[book-success-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <h2 id={titleId} className="text-[17px] font-bold tracking-tight text-neutral-950">
          {activating ? `Activate ${name}?` : `Deactivate ${name}?`}
        </h2>
        <p id={descriptionId} className="mx-auto mt-2 max-w-[280px] text-sm leading-5 text-[#8d97ab]">
          {activating
            ? "This customer will be able to sign in again."
            : "This customer will not be able to sign in until they are activated again."}
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onClose}
            className="h-11 flex-1 rounded-lg border-neutral-200 text-sm font-medium text-neutral-700 shadow-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="h-11 flex-1 rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover"
          >
            {pending ? (activating ? "Activating…" : "Deactivating…") : activating ? "Activate" : "Deactivate"}
          </Button>
        </div>
      </section>
    </div>
  );
}

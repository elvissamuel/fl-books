"use client";

import { useEffect, useId, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationAddedDialog({
  kind,
  onDone,
}: {
  kind: "pickup" | "outlet";
  onDone: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDone();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDone]);

  return (
    <div className="fixed inset-y-0 right-0 left-0 z-50 flex items-center justify-center px-4 md:left-[232px]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/20 motion-safe:animate-[book-scrim-in_320ms_ease-out_both]"
        aria-label="Close success message"
        onClick={onDone}
      />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-w-[360px] rounded-2xl bg-white px-7 pt-8 pb-7 text-center shadow-[0_18px_50px_rgba(17,24,22,0.18)] outline-none motion-safe:animate-[book-success-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#22c55e]">
          <Check className="size-7 text-white" strokeWidth={2.75} />
        </div>
        <h2 id={titleId} className="mt-5 text-[17px] font-bold tracking-tight text-neutral-950">
          Location Added Successfully
        </h2>
        <p id={descriptionId} className="mx-auto mt-2 max-w-[280px] text-sm leading-5 text-[#8d97ab]">
          {kind === "pickup"
            ? "The pickup location has been added successfully and is now available in the system."
            : "The delivery outlet has been added successfully and is now available in the system."}
        </p>
        <Button
          type="button"
          onClick={onDone}
          className="mt-6 h-11 w-full rounded-lg bg-brand text-sm font-medium text-white hover:bg-brand-hover"
        >
          Done
        </Button>
      </section>
    </div>
  );
}

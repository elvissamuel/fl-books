import { Fraunces } from "next/font/google";
import { cn } from "@/lib/utils";

const wordmark = Fraunces({
  subsets: ["latin"],
  weight: "600",
});

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        wordmark.className,
        "text-[1.65rem] leading-none tracking-[-0.03em] text-brand",
        className,
      )}
    >
      AFL
    </span>
  );
}

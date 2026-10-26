import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "light";
}) {
  return (
    <Image
      src="/afl-logo.png"
      alt="AFL"
      width={92}
      height={25}
      priority
      className={cn("h-5 w-auto", tone === "light" && "brightness-0 invert", className)}
    />
  );
}

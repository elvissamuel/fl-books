import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "light";
}) {
  const light = tone === "light";

  return (
    <Image
      src={light ? "/AFL-Books-04.png" : "/AFL-Books-03.png"}
      alt="AFL"
      width={1559}
      height={1559}
      sizes="(min-width: 768px) 128px, 96px"
      priority
      className={cn("h-24 w-auto", light && "brightness-0 invert", className)}
    />
  );
}

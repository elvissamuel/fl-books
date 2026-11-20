import Image from "next/image";
import Link from "next/link";
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
    <Link href="/" aria-label="AFL Books home" className="inline-flex shrink-0 items-center">
      <Image
        src={light ? "/AFL-Books-04.png" : "/AFL-Books-03.png"}
        alt="AFL Books"
        width={1559}
        height={1559}
        sizes="(min-width: 768px) 128px, 96px"
        priority
        className={cn("h-24 w-auto", light && "brightness-0 invert", className)}
      />
    </Link>
  );
}

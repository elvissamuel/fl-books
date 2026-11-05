import { ChevronRight, Star } from "lucide-react";

export const catalogCanvas = "#f4f5f9";
export const catalogOrange = "#f47832";
export const bookCrop = "[object-view-box:inset(11.6%_20.8%_4.6%_27.4%)]";

export function SectionHeading({
  id,
  title,
  subtitle,
  href,
}: {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2
          id={id}
          className="relative inline-block pb-1 text-[22px] font-semibold tracking-[-0.02em] text-brand"
        >
          {title}
          <span className="absolute bottom-0 left-0 h-[3px] w-11 rounded-full bg-[#fb7d48]" />
        </h2>
        <p className="mt-2.5 text-[13.5px] text-[#8d939c]">{subtitle}</p>
      </div>
      <a
        href={href}
        className="mb-0.5 inline-flex items-center gap-0.5 text-[13px] font-medium text-[#9aa1ab] hover:text-brand"
      >
        See All
        <ChevronRight className="size-3.5" />
      </a>
    </div>
  );
}

export function StarRating() {
  return (
    <div className="flex gap-0.5 text-[#f5b301]" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="size-3.5 fill-current" strokeWidth={0} />
      ))}
    </div>
  );
}

export function PriceLine() {
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-[15px] font-semibold text-[#f47832]">N8,500</span>
      <span className="text-[12px] text-[#b0b6bf] line-through">$17.00 USD</span>
    </p>
  );
}

import Image from "next/image";

export function BookCover({ src, title }: { src: string | null; title: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={40}
        height={56}
        unoptimized
        className="h-14 w-10 shrink-0 rounded-[3px] object-cover"
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={`${title} cover`}
      className="relative block h-14 w-10 shrink-0 overflow-hidden rounded-[3px] bg-[#c43832] shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
    >
      <span className="absolute inset-x-0 top-1.5 h-[3px] bg-neutral-950" />
      <span className="absolute inset-x-0 top-3.5 h-px bg-neutral-950" />
      <span className="absolute top-[18px] right-1 left-1 h-5 rounded-[1px] bg-[#f4efe4]" />
      <span className="absolute inset-x-0 bottom-3.5 h-px bg-neutral-950" />
      <span className="absolute inset-x-0 bottom-1.5 h-[3px] bg-neutral-950" />
    </span>
  );
}

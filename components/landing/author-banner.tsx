import Image from "next/image";

export function AuthorBanner() {
  return (
    <section
      className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden bg-[#101412] text-white sm:min-h-[460px]"
      aria-labelledby="author-banner"
    >
      <Image
        src="/afl-banner.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[center_22%]"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center px-6 py-16 text-center">
        <h2
          id="author-banner"
          className="text-[30px] font-semibold tracking-[-0.03em] text-white sm:text-[40px]"
        >
          One Voice, Many Lives Changed
        </h2>
        <p className="mt-4 max-w-[640px] text-[14.5px] leading-6 text-white/90 sm:text-[15.5px]">
          For over a decade, Femi Lazarus has written and spoken into the lives of thousands, equipping
          them with practical wisdom for faith, leadership, growth, and purposeful living.
        </p>
        <a
          href="#about-author"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-brand px-5 text-[14px] font-medium text-white hover:bg-brand-hover"
        >
          Meet The Author
        </a>
      </div>
    </section>
  );
}

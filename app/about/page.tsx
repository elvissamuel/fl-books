import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { CartProvider } from "@/components/cart/cart-provider";
import { StoreHeader } from "@/components/catalog/store-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "About Author",
};

const bio =
  "Lorem ipsum dolor sit amet consectetur. Mattis lorem semper diam ornare faucibus lobortis condimentum. Tincidunt in urna feugiat orci imperdiet in non aliquam. Etiam amet est ornare ullamcorper scelerisque. Dignissim pulvinar donec viverra odio nisl euismod dictum. Odio semper sed dui a suscipit lorem ipsum dolor. Nisi adipiscing scelerisque convallis lorem donec. Nibh ridiculus malesuada diam felis sed. Pharetra duis phasellus mi condimentum arcu eu. At habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc neque quis nisl mi vestibulum lacinia urna semper.";

export default function AboutPage() {
  return (
    <CartProvider>
      <main className={`${ptSerif.className} bg-white`}>
        <StoreHeader active="About Author" />
        <section className="relative isolate h-[280px] overflow-hidden bg-[#101114] sm:h-[360px] lg:h-[420px]" aria-label="About Author">
          <img
            src="/animo-wheel-carousel-720p.gif"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <h1 className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-4 text-center text-[40px] leading-none font-bold tracking-[0.08em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-[56px] lg:text-[72px]">
            About Author
          </h1>
        </section>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block" aria-hidden="true">
            <span className="absolute top-[6%] right-[18%] size-[300px] rounded-full bg-[#eef1f4]" />
            <span className="absolute top-[34%] right-[-6%] size-[340px] rounded-full bg-[#f4f6f8]" />
            <span className="absolute bottom-[4%] left-[8%] size-[220px] rounded-full bg-[#e8ebef]" />
          </div>
          <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_540px] lg:gap-14 lg:py-20">
            <div className="max-w-[600px]">
              <h2 className="text-[40px] font-bold tracking-[-0.03em] text-[#1c1f24] sm:text-[52px]">
                Femi Lazarus
              </h2>
              <p className="mt-6 text-[17px] leading-8 text-[#8b919a] sm:text-[18px] sm:leading-9">{bio}</p>
              <div className="mt-8 flex items-center gap-6 text-[#1c1f24]">
                <SocialLink label="YouTube">
                  <path d="M10 9.2v5.6l4.8-2.8L10 9.2z" />
                  <rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </SocialLink>
                <SocialLink label="Instagram">
                  <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
                </SocialLink>
                <SocialLink label="Facebook">
                  <path d="M14 9h2.2V6.2H14c-2.3 0-3.8 1.4-3.8 3.9V12H8v2.8h2.2V20h2.8v-5.2h2.3L16 12h-2.8v-1.5c0-.6.3-1.5.8-1.5z" />
                </SocialLink>
              </div>
            </div>
            <Image
              src="/about-afl.png"
              alt="Femi Lazarus"
              width={688}
              height={726}
              className="relative z-10 mx-auto w-full max-w-[540px]"
            />
          </div>
        </section>
        <LandingFooter />
      </main>
    </CartProvider>
  );
}

function SocialLink({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a href={`#${label.toLowerCase()}`} aria-label={label} className="text-[#1c1f24] hover:text-brand">
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}

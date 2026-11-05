import type { ReactNode } from "react";
import Image from "next/image";
import { BrandMark } from "@/components/brand/brand-mark";

const shopLinks = ["All Books", "Bestsellers", "New Releases"] as const;
const supportLinks = ["Contact Us", "Shipping Policy", "Refunds", "Terms & Privacy"] as const;

export function LandingFooter() {
  return (
    <div>
      <section className="relative isolate overflow-hidden text-white" aria-labelledby="contact-band">
        <Image
          src="/landing/contact-banner.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center blur-2xl scale-125"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex max-w-[1180px] flex-col gap-8 px-6 py-14 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-16">
          <div className="max-w-[460px]">
            <h2 id="contact-band" className="text-[28px] leading-tight font-semibold tracking-[-0.03em] sm:text-[32px]">
              Have A Question? We&apos;d Love To Hear From You
            </h2>
            <p className="mt-3 max-w-[420px] text-[14.5px] leading-6 text-white/85">
              Whether it&apos;s about an order, a book recommendation, or just to say hello, our team is
              one message away.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#f47832] px-5 text-[14px] font-medium text-white hover:bg-[#e56d28]"
            >
              Contact Us
            </a>
          </div>
          <form
            id="contact"
            className="w-full max-w-[440px] rounded-[22px] bg-[#ffe5da] p-6 text-[#1c1f24] sm:p-7"
          >
            <h3 className="text-[18px] font-semibold">Subscribe to Our Newsletter</h3>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-[13.5px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf]"
              />
              <button
                type="button"
                className="h-11 shrink-0 rounded-full bg-[#f47832] px-5 text-[13.5px] font-medium text-white hover:bg-[#e56d28]"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#111116] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-12 sm:px-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-14">
          <div>
            <BrandMark tone="light" className="h-7" />
            <p className="mt-4 max-w-[280px] text-[13.5px] leading-6 text-white/65">
              The official authoritative home for all books by Femi Lazarus. Read by leaders worldwide.
            </p>
            <div className="mt-5 flex items-center gap-3 text-white/80">
              <SocialIcon label="X">
                <path d="M4 4l6.5 8.2L4.4 20H6.6l4.7-5.8L15.6 20H20l-6.8-8.6L19.4 4h-2.2l-4.3 5.3L8.2 4H4z" />
              </SocialIcon>
              <SocialIcon label="Instagram">
                <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
              </SocialIcon>
              <SocialIcon label="Facebook">
                <path d="M14 9h2.2V6.2H14c-2.3 0-3.8 1.4-3.8 3.9V12H8v2.8h2.2V20h2.8v-5.2h2.3L16 12h-2.8v-1.5c0-.6.3-1.5.8-1.5z" />
              </SocialIcon>
              <SocialIcon label="Podcast">
                <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 11a5 5 0 0 0 10 0M12 16v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </SocialIcon>
            </div>
          </div>
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-6 py-4 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
            <p>© 2026 Femi Lazarus. All rights reserved.</p>
            <p className="flex items-center gap-5">
              <span>Secured by Stripe</span>
              <span>Paystack</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly string[] }) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((label) => (
          <li key={label}>
            <a
              href={label === "All Books" ? "/books" : `#${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="text-[13.5px] text-white/65 hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a href={`#${label.toLowerCase()}`} aria-label={label} className="text-white/75 hover:text-white">
      <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}

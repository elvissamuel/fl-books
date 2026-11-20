import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/contact-form";
import { CartProvider } from "@/components/cart/cart-provider";
import { StoreHeader } from "@/components/catalog/store-header";
import { catalogCanvas } from "@/components/landing/catalog-shared";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <CartProvider>
      <main className={ptSerif.className} style={{ backgroundColor: catalogCanvas }}>
        <StoreHeader active="Contact Us" />
        <section className="relative isolate h-[220px] overflow-hidden bg-[#101114] sm:h-[280px]" aria-label="Contact Us">
          <img
            src="/animo-wheel-carousel-720p.gif"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <h1 className="relative z-10 flex h-full items-center justify-center px-6 text-center text-[40px] font-bold tracking-[0.08em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-[56px]">
            Contact Us
          </h1>
        </section>
        <section className="mx-auto grid max-w-[1080px] items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14 lg:py-16">
          <div className="relative mx-auto w-full max-w-[460px]">
            <Image
              src="/contact-img-1.png"
              alt="Let's talk!"
              width={611}
              height={263}
              className="relative z-10 mx-auto -mb-8 w-[78%]"
            />
            <Image
              src="/contact-img-2.png"
              alt="Two readers with a book"
              width={740}
              height={635}
              className="w-full"
            />
          </div>
          <ContactForm />
        </section>
        <LandingFooter />
      </main>
    </CartProvider>
  );
}

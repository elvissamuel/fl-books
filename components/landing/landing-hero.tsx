import Image from "next/image";
import { Search } from "lucide-react";
import { AccountMenu } from "@/components/auth/account-menu";
import { BrandMark } from "@/components/brand/brand-mark";
import { CartButton } from "@/components/cart/cart-button";
import { getCustomerSession } from "@/infrastructure/auth/customer-session";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "About Author", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

const shelfBooks = [
  { src: "/The_market_place_called_life_1.png", alt: "The Market Called Life" },
  { src: "/Scent_of_Water_1.png", alt: "Scent of Water" },
  { src: "/audacity_of_faith.png", alt: "Audacity of Faith" },
  { src: "/break_free.png", alt: "Break Free" },
] as const;

const bookCrop = "[object-view-box:inset(11.6%_20.8%_4.6%_27.4%)]";

export async function LandingHero() {
  const session = await getCustomerSession();

  return (
    <section className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#0c0e10] text-white">
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.15)_38%,rgba(0,0,0,0.55)_100%)]" />

      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
        <BrandMark tone="light" className="h-7" />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "text-[13.5px] font-medium transition-colors duration-300 ease-out",
                link.label === "Home" ? "text-white" : "text-white/75 hover:text-white",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 sm:gap-5">
          <button type="button" aria-label="Search" className="text-white">
            <Search className="size-[18px]" strokeWidth={1.75} />
          </button>
          <CartButton className="text-white" />
          {session ? (
            <AccountMenu />
          ) : (
            <a
              href="/login"
              className="inline-flex h-9 items-center rounded-md bg-brand px-4 text-[13px] font-medium text-white transition-colors duration-300 ease-out hover:bg-brand-hover"
            >
              Sign In
            </a>
          )}
        </div>
      </header>

      <div className="hero-grid relative z-10 flex w-full flex-1 flex-col px-6 pt-10 sm:px-10 lg:px-14 lg:pt-12">
        <div className="hero-copy relative z-10 max-w-[760px]">
          <h1 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.03em] text-white sm:text-[40px] lg:text-[44px]">
            Discover Words That Strengthen Your Faith, Challenge Your Thinking, and Transform the Way
            You Live
          </h1>
          <p className="mt-5 max-w-[620px] text-[14px] leading-6 text-white/70 sm:text-[15px]">
            Explore a growing collection of books written to challenge your perspective, strengthen
            your faith, and equip you for the different seasons and decisions life brings.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <a
              href="#collection"
              className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-[13.5px] font-medium text-white transition-colors duration-300 ease-out hover:bg-brand-hover"
            >
              Explore the Collection
            </a>
            <a href="#learn-more" className="text-[13.5px] font-medium text-white/90 transition-colors duration-300 ease-out hover:text-white">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-books relative z-10 flex items-end -mt-40">
          {shelfBooks.map((book) => (
            <BookShot
              key={book.src}
              src={book.src}
              alt={book.alt}
              className="hero-shelf aspect-[229/324]"
            />
          ))}
          <BookShot
            src="/possessing_the_gates_of_the_enemy.png"
            alt="Possessing the Gates of the Enemy"
            priority
            className="hero-feature aspect-[229/324]"
          />
        </div>
      </div>
      <style>{`
        .hero-books { gap: 12px; flex-wrap: wrap; justify-content: center; }
        .hero-shelf { width: 76px; flex: none; }
        .hero-feature { width: 168px; flex: none; }
        @media (min-width: 640px) {
          .hero-books { gap: 16px; flex-wrap: nowrap; justify-content: flex-start; }
          .hero-shelf { width: 120px; }
          .hero-feature { width: 200px; }
        }
        @media (min-width: 1024px) {
          .hero-books {
            gap: clamp(36px, 4.4vw, 66px);
            margin-left: calc(-3.5rem - clamp(44px, 3.5vw, 58px));
            margin-right: -3.5rem;
            padding-right: 4rem;
          }
          .hero-shelf { width: clamp(156px, 13.6vw, 204px); }
          .hero-shelf:first-child { margin-left: 0; }
          .hero-feature { width: clamp(280px, 24vw, 364px); }
        }
      `}</style>
    </section>
  );
}

function BookShot({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative drop-shadow-[0_22px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 432px, 260px"
        className={cn("object-fill", bookCrop)}
      />
    </div>
  );
}

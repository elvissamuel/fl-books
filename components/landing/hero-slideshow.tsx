"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AccountMenu } from "@/components/auth/account-menu";
import { AuthBackground } from "@/components/auth/auth-background";
import { BrandMark } from "@/components/brand/brand-mark";
import { CartButton } from "@/components/cart/cart-button";
import { MobileNavMenu } from "@/components/navigation/mobile-nav-menu";
import { CustomerNotificationBell } from "@/components/notifications/customer-notification-bell";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "About Author", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

const bookCrop = "[object-view-box:inset(12.2%_21.6%_5.8%_27.8%)]";
const slideMs = 6500;

type HeroSlide = {
  src: string;
  alt: string;
  title: string;
  body: string;
  overlay: string;
  ink: "light" | "dark";
  flat?: boolean;
};

const slides: HeroSlide[] = [
  {
    src: "/possessing_the_gates_of_the_enemy.png",
    alt: "Possessing the Gates of the Enemy",
    title: "Discover Words That Strengthen Your Faith, Challenge Your Thinking, and Transform the Way You Live",
    body: "Explore a growing collection of books written to challenge your perspective, strengthen your faith, and equip you for the different seasons and decisions life brings.",
    overlay: "rgba(8, 10, 12, 0.9)",
    ink: "light",
  },
  {
    src: "/break_free.png",
    alt: "Break Free",
    title: "Find the Wisdom to Navigate Life's Seasons, Strengthen Your Faith, and Walk Boldly Into Your Purpose",
    body: "Discover timeless insights on faith, purpose, relationships, courage, and the journey of becoming who you were created to be.",
    overlay: "rgba(48, 20, 10, 0.88)",
    ink: "light",
  },
  {
    src: "/audacity_of_faith.png",
    alt: "Audacity of Faith",
    title: "Books That Speak to the Questions of Life, the Journey of Faith, and the Person You Are Becoming",
    body: "A collection of thought-provoking books designed to inspire deeper faith, wiser decisions, and meaningful transformation.",
    overlay: "rgba(246, 247, 249, 0.94)",
    ink: "dark",
  },
  {
    src: "/Scent_of_Water_1.png",
    alt: "Scent of Water",
    title: "Explore Timeless Wisdom for Building Stronger Faith, Making Better Choices, and Living With Greater Purpose",
    body: "Books and resources created to help you navigate faith, relationships, purpose, and the realities of everyday life with greater wisdom.",
    overlay: "rgba(8, 30, 58, 0.9)",
    ink: "light",
  },
  {
    src: "/The_market_place_called_life_1.png",
    alt: "The Market Called Life",
    title: "Let Every Page Challenge Your Perspective, Deepen Your Faith, and Give You Courage for the Journey Ahead",
    body: "A thought-provoking exploration of the decisions, exchanges, and seasons that shape your destiny — and how to trade wisely with the time you're given.",
    overlay: "rgba(244, 245, 247, 0.94)",
    ink: "dark",
  },
  {
    src: "/Wedluck-1.png",
    alt: "Wedluck",
    title: "Marriage Isn't Left To Chance, Discover The Wisdom Behind Wedluck",
    body: "A refreshing, faith-rooted take on love and commitment, revealing that a thriving marriage is built on wisdom, not luck.",
    overlay: "rgba(6, 64, 60, 0.9)",
    ink: "light",
  },
];

export function HeroSlideshow({ signedIn, pictureUrl = "" }: { signedIn: boolean; pictureUrl?: string }) {
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);
  const slide = slides[active];
  const light = slide.ink === "light";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, slideMs);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <section className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#0c0e10]">
      <AuthBackground />
      {slides.map((item, index) => (
        <div
          key={item.src}
          className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
          style={{ backgroundColor: item.overlay, opacity: index === active ? 1 : 0 }}
        />
      ))}

      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-14">
        <BrandMark tone={light ? "light" : "brand"} className="h-24 md:h-32" />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "text-[16px] font-medium transition-colors duration-700 ease-out",
                light
                  ? link.label === "Home"
                    ? "text-white"
                    : "text-white/75 hover:text-white"
                  : link.label === "Home"
                    ? "text-[#1c1f24]"
                    : "text-[#5e6772] hover:text-[#1c1f24]",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 sm:gap-5">
          <MobileNavMenu tone={light ? "light" : "dark"} active="Home" />
          <CartButton className={cn("hidden md:inline-block", light ? "text-white" : "text-[#1c1f24]")} />
          {signedIn ? <CustomerNotificationBell tone={light ? "light" : "dark"} /> : null}
          {signedIn ? (
            <AccountMenu pictureUrl={pictureUrl} />
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

      <div className="relative z-10 grid w-full flex-1 items-center gap-8 px-6 pt-4 pb-14 sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-6 lg:px-14 lg:pb-10">
        <div className="relative">
          {slides.map((item, index) => {
            const shown = index === active;
            const pale = item.ink === "light";
            return (
              <div
                key={item.src}
                className={cn(
                  "transition-all duration-700 ease-out motion-reduce:transition-none",
                  shown ? "relative translate-y-0 opacity-100" : "pointer-events-none absolute inset-0 translate-y-3 opacity-0",
                )}
                aria-hidden={shown ? undefined : true}
                inert={shown ? undefined : true}
              >
                <h1
                  className={cn(
                    "text-[34px] leading-[1.12] font-semibold tracking-[-0.03em] sm:text-[42px] lg:text-[50px] xl:text-[54px]",
                    pale ? "text-white" : "text-[#1c1f24]",
                  )}
                >
                  {item.title}
                </h1>
                <p
                  className={cn(
                    "mt-5 max-w-[40rem] text-[18px] leading-8 sm:text-[20px] lg:text-[22px]",
                    pale ? "text-white/75" : "text-[#5c6570]",
                  )}
                >
                  {item.body}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href="#collection"
                    className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-[13.5px] font-medium text-white transition-colors duration-300 ease-out hover:bg-brand-hover"
                  >
                    Explore the Collection
                  </a>
                  <a
                    href="#learn-more"
                    className={cn(
                      "text-[13.5px] font-medium transition-colors duration-300 ease-out",
                      pale ? "text-white/90 hover:text-white" : "text-[#1c1f24] hover:text-black",
                    )}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative ml-auto h-[280px] w-full max-w-[380px] sm:h-[360px] sm:max-w-[460px] lg:h-[min(76vh,680px)] lg:w-[calc(min(76vh,680px)*0.78)] lg:max-w-none">
          {slides.map((item, index) => (
            <div
              key={item.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
                index === active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={index === active ? undefined : true}
            >
              <HeroBook slide={item} priority={index < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroBook({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  if (slide.flat) {
    return (
      <div className="relative h-full w-full drop-shadow-[0_24px_36px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-y-[1%] right-[8%] left-0 overflow-hidden bg-[#128f86]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 420px, 70vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-y-[1%] right-0 w-[8%] bg-[#0b3d3a]" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full drop-shadow-[0_24px_36px_rgba(0,0,0,0.4)]">
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 460px, 70vw"
        className={cn("object-cover object-center", bookCrop)}
      />
    </div>
  );
}

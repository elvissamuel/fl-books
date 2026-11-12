"use client";

import { useLayoutEffect, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function RevealSection({ className, children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let observer: IntersectionObserver | null = null;
    let timer = 0;
    let onEnd: ((event: AnimationEvent) => void) | null = null;

    const settle = () => {
      node.dataset.reveal = "settled";
    };

    const play = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        settle();
        return;
      }

      const pieces = node.querySelectorAll(".landing-piece, .landing-stagger > *");
      if (pieces.length === 0) {
        settle();
        return;
      }

      let pending = pieces.length;
      onEnd = (event: AnimationEvent) => {
        if (!(event.target instanceof Element)) return;
        if (!event.target.matches(".landing-piece, .landing-stagger > *")) return;
        if (event.animationName !== "landing-rise" && event.animationName !== "landing-card") return;
        pending -= 1;
        if (pending <= 0) settle();
      };
      node.addEventListener("animationend", onEnd);
      timer = window.setTimeout(settle, 2200);
      node.dataset.reveal = "shown";
    };

    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.88 && rect.bottom > 48;
    if (inView) {
      play();
    } else {
      node.dataset.reveal = "hidden";
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          play();
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(timer);
      if (onEnd) node.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    <section ref={ref} className={cn("landing-reveal", className)} {...props}>
      {children}
    </section>
  );
}

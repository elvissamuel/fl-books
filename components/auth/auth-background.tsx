"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function AuthBackground() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlay(!reduce.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  if (!play) {
    return (
      <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="object-cover object-center" />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/hero-bg.png"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-center"
    >
      <source src="/animo-card-tunnel-720p.mp4" type="video/mp4" />
    </video>
  );
}

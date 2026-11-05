"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const signInMessage = "Sign in to add books to your cart.";

export function CartAuthMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [here, setHere] = useState(pathname);

  useEffect(() => {
    setHere(window.location.pathname + window.location.search);
  }, [pathname]);

  if (message === signInMessage) {
    return (
      <p className={className}>
        <a href={`/login?next=${encodeURIComponent(here)}`} className="underline underline-offset-2">
          Sign in
        </a>{" "}
        to add books to your cart.
      </p>
    );
  }

  return <p className={className}>{message}</p>;
}

"use client";

import { useEffect, useRef } from "react";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";
const googleScript = "https://accounts.google.com/gsi/client";

type CredentialHandler = (idToken: string) => void;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup";
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type: "standard";
              theme: "outline";
              size: "large";
              text: "signin_with" | "signup_with";
              width: number;
            },
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  label,
  mode,
  disabled,
  onCredential,
  onUnavailable,
}: {
  label: string;
  mode: "sign-in" | "sign-up";
  disabled?: boolean;
  onCredential: CredentialHandler;
  onUnavailable: (message: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onUnavailableRef = useRef(onUnavailable);
  onCredentialRef.current = onCredential;
  onUnavailableRef.current = onUnavailable;

  useEffect(() => {
    if (!googleClientId) return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    function render() {
      const google = window.google?.accounts.id;
      if (cancelled || !host || !google) return;
      google.initialize({
        client_id: googleClientId,
        ux_mode: "popup",
        auto_select: false,
        callback: (response) => {
          if (response.credential) onCredentialRef.current(response.credential);
          else onUnavailableRef.current("Google did not return a sign-in token.");
        },
      });
      host.replaceChildren();
      google.renderButton(host, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: mode === "sign-up" ? "signup_with" : "signin_with",
        width: Math.max(Math.round(host.getBoundingClientRect().width), 280),
      });
    }

    if (window.google?.accounts.id) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${googleScript}"]`);
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = googleScript;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    script.addEventListener("error", () => onUnavailableRef.current("Google sign-in could not be loaded."));

    return () => {
      cancelled = true;
      script.removeEventListener("load", render);
    };
  }, [mode]);

  if (!googleClientId) {
    return (
      <button type="button" disabled={disabled} onClick={() => onUnavailable("Google sign-in is not configured.")} className={buttonClass}>
        <GoogleMark />
        {label}
      </button>
    );
  }

  return (
    <div className={`group relative h-11 w-full ${disabled ? "pointer-events-none opacity-70" : ""}`}>
      <div className={`pointer-events-none group-hover:bg-[#fafafa] ${buttonClass}`} aria-hidden="true">
        <GoogleMark />
        {label}
      </div>
      <div
        ref={hostRef}
        className="absolute inset-0 overflow-hidden opacity-[0.01] [&_iframe]:!h-11 [&_iframe]:!min-w-full"
      />
    </div>
  );
}

const buttonClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e4e7ec] bg-white text-[14px] text-[#1c1f24] hover:bg-[#fafafa]";

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

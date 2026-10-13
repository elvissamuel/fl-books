import type { ShippingCountry } from "@/core/dashboard/types";

export function CountryFlag({ code }: { code: ShippingCountry["code"] }) {
  return (
    <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] ring-1 ring-black/10">
      {code === "US" ? <UnitedStatesFlag /> : null}
      {code === "NG" ? <NigeriaFlag /> : null}
      {code === "CA" ? <CanadaFlag /> : null}
      {code === "GH" ? <GhanaFlag /> : null}
    </span>
  );
}

function UnitedStatesFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full" aria-hidden="true">
      <rect width="20" height="14" fill="#b22234" />
      <rect y="1.08" width="20" height="1.08" fill="#fff" />
      <rect y="3.23" width="20" height="1.08" fill="#fff" />
      <rect y="5.38" width="20" height="1.08" fill="#fff" />
      <rect y="7.54" width="20" height="1.08" fill="#fff" />
      <rect y="9.69" width="20" height="1.08" fill="#fff" />
      <rect y="11.85" width="20" height="1.08" fill="#fff" />
      <rect width="8.2" height="7.5" fill="#3c3b6e" />
    </svg>
  );
}

function NigeriaFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full" aria-hidden="true">
      <rect width="6.7" height="14" fill="#008751" />
      <rect x="6.7" width="6.6" height="14" fill="#fff" />
      <rect x="13.3" width="6.7" height="14" fill="#008751" />
    </svg>
  );
}

function CanadaFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full" aria-hidden="true">
      <rect width="20" height="14" fill="#fff" />
      <rect width="5" height="14" fill="#d52b1e" />
      <rect x="15" width="5" height="14" fill="#d52b1e" />
      <path
        d="M10 3.1 10.7 5.1h1.7L11.2 6.3l.5 1.8L10 7.2 8.3 8.1l.5-1.8L7.6 5.1H9.3z"
        fill="#d52b1e"
      />
    </svg>
  );
}

function GhanaFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full" aria-hidden="true">
      <rect width="20" height="4.67" fill="#ce1126" />
      <rect y="4.67" width="20" height="4.66" fill="#fcd116" />
      <rect y="9.33" width="20" height="4.67" fill="#006b3f" />
      <path
        d="M10 5.3 10.55 6.9h1.7l-1.38 1 0.53 1.6L10 8.5 8.6 9.5l.53-1.6-1.38-1h1.7z"
        fill="#000"
      />
    </svg>
  );
}

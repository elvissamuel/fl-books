"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CountryFlag } from "@/components/dashboard/country-flag";
import { useShippingCountries } from "@/features/dashboard/use-dashboard";

export function TopCountriesCard() {
  const { data } = useShippingCountries();

  if (!data) {
    return null;
  }

  return (
    <Card className="gap-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-neutral-200/80">
      <CardHeader>
        <CardTitle className="text-[15px] font-semibold text-neutral-900">
          Top countries (shipping)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ul className="flex flex-col gap-3">
          {data.countries.map((country) => (
            <li key={country.code} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-[13px]">
              <span className="flex min-w-0 items-center gap-2 text-neutral-700">
                <CountryFlag code={country.code} />
                <span className="truncate">{country.name}</span>
              </span>
              <span className="w-8 text-right text-neutral-600 tabular-nums">{country.orders}</span>
              <span className="w-10 text-right text-neutral-500 tabular-nums">{country.shareLabel}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-[13px] font-semibold text-neutral-900">
          <span>Total</span>
          <span className="w-8 text-right tabular-nums">{data.totalOrders}</span>
          <span className="w-10 text-right tabular-nums">{data.totalShareLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

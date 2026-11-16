"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GetInTouchScreen } from "@/components/get-in-touch/get-in-touch-screen";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NewsletterScreen } from "@/components/newsletter/newsletter-screen";
import { TestimonialsScreen } from "@/components/testimonials/testimonials-screen";
import { audienceTabs, type AudienceTab } from "@/components/audience/audience-tabs";
import { cn } from "@/lib/utils";

export function AudienceScreen({ initialTab }: { initialTab: AudienceTab }) {
  const router = useRouter();
  const [tab, setTab] = useState<AudienceTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  function selectTab(next: AudienceTab) {
    setTab(next);
    router.replace(`/admin/audience?tab=${next}`);
  }

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Audience</h1>
        <NotificationBell />
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Audience">
        {audienceTabs.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(item.id)}
              className={cn(
                "h-8 rounded-full border bg-white px-3 text-xs font-medium",
                selected
                  ? "border-brand text-brand"
                  : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "get-in-touch" ? <GetInTouchScreen embedded /> : null}
      {tab === "testimonials" ? <TestimonialsScreen embedded /> : null}
      {tab === "newsletter" ? <NewsletterScreen embedded /> : null}
    </div>
  );
}

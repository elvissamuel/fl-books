"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { adminNavigation } from "@/components/admin/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-[232px] shrink-0 flex-col bg-brand text-white">
      <div className="px-5 pt-6 pb-4">
        <BrandMark tone="light" />
      </div>
      <nav className="flex flex-col gap-1 px-3" aria-label="Admin">
        {adminNavigation.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-white text-neutral-900"
                  : "text-white/95 hover:bg-white/10",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto h-28 bg-gradient-to-b from-transparent to-black/20" />
    </aside>
  );
}

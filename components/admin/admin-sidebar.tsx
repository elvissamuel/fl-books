"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/admin/(protected)/logout-action";
import { adminNavigation } from "@/components/admin/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-[232px] shrink-0 flex-col bg-brand text-white">
      <div className="px-5 pt-6 pb-4">
        <Link href="/" aria-label="AFL Books home" className="inline-flex">
          <Image
            src="/AFL-Books-04.png"
            alt="AFL Books"
            width={520}
            height={280}
            priority
            className="h-14 w-auto mix-blend-screen"
          />
        </Link>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3" aria-label="Admin">
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
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/15 px-4 py-4">
        <Link href="/admin/settings" aria-label="Profile" className="rounded-full">
          <Image
            src="/admin-profile.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-2 ring-white/40"
          />
        </Link>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium text-white/95 hover:bg-white/10"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}

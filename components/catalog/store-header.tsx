import { AccountMenu } from "@/components/auth/account-menu";
import { BrandMark } from "@/components/brand/brand-mark";
import { CartButton } from "@/components/cart/cart-button";
import { MobileNavMenu } from "@/components/navigation/mobile-nav-menu";
import { CustomerNotificationBell } from "@/components/notifications/customer-notification-bell";
import { getCustomerSession } from "@/infrastructure/auth/customer-session";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "About Author", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

export async function StoreHeader({ active = "Books" }: { active?: string | null }) {
  const session = await getCustomerSession();

  return (
    <header className="relative z-20 flex items-center justify-between bg-white px-6 py-5 sm:px-10 lg:px-14">
      <BrandMark className="h-24 md:h-20" />
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex" aria-label="Primary">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              "text-[13.5px] font-medium",
              link.label === active ? "text-[#1c1f24]" : "text-[#6d7480] hover:text-[#1c1f24]",
            )}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-4 sm:gap-5">
        <MobileNavMenu active={active ?? undefined} />
        <CartButton className="hidden text-[#1c1f24] md:inline-block" />
        {session ? <CustomerNotificationBell /> : null}
        {session ? <AccountMenu /> : null}
      </div>
    </header>
  );
}

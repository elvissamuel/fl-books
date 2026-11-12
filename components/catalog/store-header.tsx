import Image from "next/image";
import { Search } from "lucide-react";
import { AccountMenu } from "@/components/auth/account-menu";
import { BrandMark } from "@/components/brand/brand-mark";
import { CartButton } from "@/components/cart/cart-button";
import { getCustomerSession } from "@/infrastructure/auth/customer-session";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "About Author", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

export async function StoreHeader({
  active = "Books",
  searchHref = "/books#book-search",
}: {
  active?: string | null;
  searchHref?: string;
}) {
  const session = await getCustomerSession();

  return (
    <header className="relative z-20 flex items-center justify-between bg-white px-6 py-5 sm:px-10 lg:px-14">
      <BrandMark className="h-7" />
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
        <a href={searchHref} aria-label="Search" className="text-[#1c1f24]">
          <Search className="size-[18px]" strokeWidth={1.75} />
        </a>
        <CartButton className="text-[#1c1f24]" />
        {session ? (
          <AccountMenu />
        ) : (
          <Image
            src="/admin-profile.png"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        )}
      </div>
    </header>
  );
}

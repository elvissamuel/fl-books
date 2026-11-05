import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PageToken = number | "ellipsis";

function catalogPages(current: number, total: number): PageToken[] {
  if (total <= 6) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, "ellipsis", total - 1, total];
  if (current >= total - 2) return [1, 2, "ellipsis", total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function catalogHref(page: number, search: string, categoryId: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoryId) params.set("categoryId", categoryId);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/books?${query}` : "/books";
}

export function CatalogPagination({
  page,
  totalPages,
  search,
  categoryId,
}: {
  page: number;
  totalPages: number;
  search: string;
  categoryId: string;
}) {
  const tokens = catalogPages(page, totalPages);

  return (
    <nav
      className="mx-auto flex w-full max-w-[760px] items-center justify-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(20,24,40,0.04)]"
      aria-label="Pagination"
    >
      <PageLink
        label="Previous page"
        href={page > 1 ? catalogHref(page - 1, search, categoryId) : undefined}
      >
        <ChevronLeft className="size-4" />
      </PageLink>
      {tokens.map((token, index) =>
        token === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1.5 text-[13px] text-[#9aa1ab]">
            ...
          </span>
        ) : (
          <PageLink
            key={token}
            label={`Page ${token}`}
            href={token === page ? undefined : catalogHref(token, search, categoryId)}
            current={token === page}
          >
            {token}
          </PageLink>
        ),
      )}
      <PageLink
        label="Next page"
        href={page < totalPages ? catalogHref(page + 1, search, categoryId) : undefined}
      >
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  label,
  current = false,
  children,
}: {
  href?: string;
  label: string;
  current?: boolean;
  children: ReactNode;
}) {
  const className = cn(
    "inline-flex size-8 items-center justify-center rounded-md text-[13px] font-medium text-[#8d939c]",
    current && "bg-brand text-white",
    href && "hover:bg-[#f4f5f9] hover:text-[#1c1f24]",
    !href && !current && "opacity-40",
  );

  if (!href) {
    return (
      <span aria-current={current ? "page" : undefined} aria-label={label} className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}

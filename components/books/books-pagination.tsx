import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PageToken = number | "ellipsis";

function visiblePages(current: number, total: number): PageToken[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis"];
  }

  if (current >= total - 3) {
    return ["ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }

  return ["ellipsis", current - 1, current, current + 1, "ellipsis"];
}

export function BooksPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const tokens = visiblePages(page, totalPages);

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <PageButton
        label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-3.5" />
      </PageButton>
      {tokens.map((token, index) =>
        token === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-xs text-neutral-400"
          >
            ...
          </span>
        ) : (
          <PageButton
            key={token}
            label={`Page ${token}`}
            current={token === page}
            onClick={() => onPageChange(token)}
          >
            {token}
          </PageButton>
        ),
      )}
      <PageButton
        label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-3.5" />
      </PageButton>
    </nav>
  );
}

function PageButton({
  children,
  label,
  current = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  label: string;
  current?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-xs font-medium text-neutral-600 transition-colors disabled:opacity-40",
        current
          ? "bg-brand text-white"
          : "hover:bg-neutral-100",
      )}
    >
      {children}
    </button>
  );
}

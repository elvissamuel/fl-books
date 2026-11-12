import { RevealSection } from "@/components/landing/reveal-section";
import { SectionHeading } from "@/components/landing/catalog-shared";
import { NewReleaseRow } from "@/components/landing/new-release-row";
import type { PublicBook } from "@/core/books/public-api";
import { publicBooksApi } from "@/infrastructure/books/http-public-books-api";

const sectionSize = 4;

async function loadNewReleases() {
  try {
    const response = await publicBooksApi.list({ page: 1, size: 100 });
    const rows = response.data?.data;
    if (!response.success || !Array.isArray(rows)) {
      return { items: [] as PublicBook[], error: response.message || "Could not load books." };
    }
    const latest = [...rows].sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );
    return { items: latest.slice(0, sectionSize), error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load books.";
    return { items: [] as PublicBook[], error: message };
  }
}

export async function NewReleases() {
  const books = await loadNewReleases();

  return (
    <RevealSection className="px-6 py-8 sm:px-10 lg:px-14" aria-labelledby="new-releases">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          id="new-releases"
          title="New Releases"
          subtitle="Whats new? Browse latest titles in the new release category"
          href="/books"
        />
        {books.error ? <p className="mb-4 text-sm text-danger">{books.error}</p> : null}
        {!books.error && books.items.length === 0 ? (
          <p className="text-sm text-[#8d939c]">No books to show yet.</p>
        ) : null}
        {books.items.length > 0 ? <NewReleaseRow books={books.items} /> : null}
      </div>
    </RevealSection>
  );
}

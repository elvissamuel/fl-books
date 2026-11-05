import Image from "next/image";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { SectionHeading, StarRating } from "@/components/landing/catalog-shared";
import type { PublicBook } from "@/core/books/public-api";
import { publicBooksApi } from "@/infrastructure/books/http-public-books-api";

const sectionSize = 8;

function naira(value: number) {
  const digits = Math.round(value).toString();
  return `₦${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

async function loadBestSellers() {
  try {
    const response = await publicBooksApi.list({ page: 1, size: 100 });
    const rows = response.data?.data;
    if (!response.success || !Array.isArray(rows)) {
      return { items: [] as PublicBook[], error: response.message || "Could not load books." };
    }
    const featured = rows.filter((book) => book.bestSeller);
    return { items: (featured.length > 0 ? featured : rows).slice(0, sectionSize), error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load books.";
    return { items: [] as PublicBook[], error: message };
  }
}

export async function BestSellers() {
  const books = await loadBestSellers();

  return (
    <section className="px-6 pt-6 pb-16 sm:px-10 lg:px-14" aria-labelledby="best-sellers">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          id="best-sellers"
          title="Best Seller Books"
          subtitle="Whats new? Browse latest titles in the new release category"
          href="/books"
        />
        {books.error ? <p className="mb-4 text-sm text-danger">{books.error}</p> : null}
        {!books.error && books.items.length === 0 ? (
          <p className="text-sm text-[#8d939c]">No books to show yet.</p>
        ) : null}
        <div id="best-seller-list" className="grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {books.items.map((book) => {
            const cover = book.coverImageUrls.find((url) => url.startsWith("https://"));
            return (
              <article
                key={book.id}
                className="flex h-full flex-col items-center border bg-white px-4 py-4 text-center"
              >
                <div className="relative aspect-[3/4] w-[78%] shrink-0">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={book.title}
                      fill
                      sizes="280px"
                      className="object-contain"
                    />
                  ) : null}
                </div>
                <div className="mt-4 flex h-3.5 shrink-0 justify-center">
                  <StarRating />
                </div>
                <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] w-full text-[16px] leading-snug font-semibold text-[#1c1f24]">
                  {book.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 min-h-10 w-full text-[13px] leading-5 text-[#8d939c]">
                  {book.shortDescription}
                </p>
                <div className="mt-auto w-full max-w-[210px] pt-3">
                  <p className="text-[15px] font-semibold text-[#f47832]">{naira(book.price)}</p>
                  <AddToCartButton
                    bookId={book.id}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f47832] text-[13.5px] font-medium text-white hover:bg-[#e56d28] disabled:opacity-60"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

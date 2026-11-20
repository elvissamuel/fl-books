import Image from "next/image";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BooksFinder } from "@/components/catalog/books-finder";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { StoreHeader } from "@/components/catalog/store-header";
import { StarRating } from "@/components/landing/catalog-shared";
import type { BookCategory } from "@/core/book-categories/category";
import type { PublicBook } from "@/core/books/public-api";

function naira(value: number) {
  const digits = Math.round(value).toString();
  return `N${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function grouped(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function BooksCatalog({
  books,
  categories,
  page,
  pageSize,
  totalElements,
  totalPages,
  search,
  categoryId,
  error,
}: {
  books: PublicBook[];
  categories: BookCategory[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  search: string;
  categoryId: string;
  error: string;
}) {
  const selected = categories.find((category) => category.id === categoryId);
  const start = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalElements);

  return (
    <div>
      <StoreHeader />
      <section className="relative isolate h-[280px] overflow-hidden bg-[#101114] text-white sm:h-[320px]">
        <img
          src="/animo-ticker-loop-720p.gif"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <h1 className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-[64px] leading-none font-bold text-white sm:text-[80px]">
          Books
        </h1>
      </section>

      <div className="relative z-10 mx-auto -mt-14 max-w-[1180px] px-6 sm:px-10 lg:px-14">
        <div className="rounded-[22px] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(20,24,40,0.08)] sm:px-7">
          <BooksFinder search={search} categoryId={categoryId} categories={categories} />
          <div className="mt-5 flex items-center justify-between gap-4 text-[13.5px]">
            <p className="font-medium text-[#1c1f24]">{selected?.name ?? "All Books"}</p>
            <p className="text-[#9aa1ab]">
              {totalElements === 0
                ? "0 results"
                : `${start}-${end} of ${grouped(totalElements)} results`}
            </p>
          </div>
        </div>

        {error ? <p className="mt-6 text-sm text-danger">{error}</p> : null}
        {!error && books.length === 0 ? (
          <p className="mt-8 text-sm text-[#8d939c]">No books found.</p>
        ) : null}

        <div className="mt-8 grid items-stretch gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => {
            const cover = book.coverImageUrls.find((url) => url.startsWith("https://"));
            return (
              <article
                key={book.id}
                className="group flex h-full flex-col items-center overflow-hidden rounded-[12px] border bg-white px-2 pt-2 pb-2.5 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,24,40,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-square w-full shrink-0">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={book.title}
                      fill
                      sizes="280px"
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : null}
                </div>
                <div className="mt-2 flex h-3.5 shrink-0 justify-center">
                  <StarRating />
                </div>
                <h2 className="mt-1.5 line-clamp-2 min-h-[2.75rem] w-full text-[16px] leading-snug font-semibold text-[#1c1f24]">
                  {book.title}
                </h2>
                <p className="mt-1 line-clamp-2 min-h-10 w-full text-[13px] leading-5 text-[#8d939c]">
                  {book.shortDescription}
                </p>
                <div className="mt-auto w-full max-w-[210px] pt-2">
                  <p className="text-[15px] font-semibold text-[#f47832]">{naira(book.price)}</p>
                  <AddToCartButton
                    bookId={book.id}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f47832] text-[13.5px] font-medium text-white transition-colors duration-300 ease-out hover:bg-[#e56d28] disabled:opacity-60"
                  />
                </div>
              </article>
            );
          })}
        </div>

        {totalPages > 1 ? (
          <div className="mt-8">
            <CatalogPagination
              page={page}
              totalPages={totalPages}
              search={search}
              categoryId={categoryId}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

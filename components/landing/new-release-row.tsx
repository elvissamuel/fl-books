"use client";

import { useState } from "react";
import Image from "next/image";
import { BookPreviewDialog } from "@/components/landing/book-preview-dialog";
import { StarRating } from "@/components/landing/catalog-shared";
import type { PublicBook } from "@/core/books/public-api";

function naira(value: number) {
  const digits = Math.round(value).toString();
  return `₦${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function coverSrc(urls: string[]) {
  return urls.find((url) => url.startsWith("https://")) ?? "";
}

export function NewReleaseRow({ books }: { books: PublicBook[] }) {
  const [bookId, setBookId] = useState<string | null>(null);

  return (
    <>
      <div
        id="new-releases-list"
        className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="landing-stagger flex gap-5">
          {books.map((book) => {
            const cover = coverSrc(book.coverImageUrls);
            return (
              <article
                key={book.id}
                className="group flex h-[320px] w-[min(94vw,640px)] shrink-0 flex-row items-center gap-5 rounded-[18px] border border-[#eceff3] bg-white px-5 py-0 shadow-[0_10px_28px_rgba(20,24,40,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(20,24,40,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-[350px] lg:w-[min(52%,660px)]"
              >
                <div className="relative h-[85%] aspect-square shrink-0">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={book.title}
                      fill
                      sizes="300px"
                      className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <StarRating />
                  <h3 className="mt-2.5 line-clamp-2 text-[22px] leading-snug font-semibold tracking-[-0.02em] text-[#1c1f24] sm:text-[24px]">
                    {book.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[16px] leading-7 text-[#8d939c]">
                    {book.shortDescription}
                  </p>
                  <div className="mt-4 sm:mt-auto sm:pt-4">
                    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <span className="text-[18px] font-semibold text-[#f47832]">{naira(book.price)}</span>
                      <span className="text-[13px] whitespace-nowrap text-[#b0b6bf] line-through">
                        $17.00 USD
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setBookId(book.id)}
                      className="mt-4 inline-flex h-11 items-center rounded-lg bg-[#f47832] px-5 text-[15px] font-medium text-white transition-colors duration-300 ease-out hover:bg-[#e56d28]"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {bookId ? <BookPreviewDialog bookId={bookId} onClose={() => setBookId(null)} /> : null}
    </>
  );
}

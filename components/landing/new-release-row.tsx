"use client";

import { useState } from "react";
import Image from "next/image";
import { BookPreviewDialog } from "@/components/landing/book-preview-dialog";
import { StarRating } from "@/components/landing/catalog-shared";
import type { PublicBook } from "@/core/books/public-api";

function naira(value: number) {
  const digits = Math.round(value).toString();
  return `N${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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
                className="group flex w-[88%] shrink-0 gap-4 rounded-[18px] bg-white p-4 shadow-[0_10px_28px_rgba(20,24,40,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(20,24,40,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[46%]"
              >
                <div className="relative h-[228px] w-[168px] shrink-0 overflow-hidden rounded-xl bg-[#f4f6f8]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={book.title}
                      fill
                      sizes="250px"
                      className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col py-1">
                  <StarRating />
                  <h3 className="mt-2 line-clamp-2 text-[17px] leading-snug font-semibold tracking-[-0.02em] text-[#1c1f24]">
                    {book.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-[#8d939c]">
                    {book.shortDescription}
                  </p>
                  <div className="mt-auto pt-3">
                    <p className="text-[15px] font-semibold text-[#f47832]">{naira(book.price)}</p>
                    <button
                      type="button"
                      onClick={() => setBookId(book.id)}
                      className="mt-3 inline-flex h-9 items-center rounded-lg bg-[#f47832] px-4 text-[13.5px] font-medium text-white transition-colors duration-300 ease-out hover:bg-[#e56d28]"
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

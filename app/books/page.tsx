import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import { BooksCatalog } from "@/components/catalog/books-catalog";
import { catalogCanvas } from "@/components/landing/catalog-shared";
import { LandingFooter } from "@/components/landing/landing-footer";
import type { BookCategory } from "@/core/book-categories/category";
import type { PublicBook } from "@/core/books/public-api";
import { publicBookCategoriesApi } from "@/infrastructure/book-categories/http-public-book-categories-api";
import { publicBooksApi } from "@/infrastructure/books/http-public-books-api";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "Books",
};

const pageSize = 8;

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    categoryId?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const search = first(params.search);
  const categoryId = first(params.categoryId);
  const requested = Number(first(params.page));
  const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

  let books: PublicBook[] = [];
  let totalElements = 0;
  let totalPages = 1;
  let categories: BookCategory[] = [];
  let error = "";

  try {
    const [bookResponse, categoryResponse] = await Promise.all([
      publicBooksApi.list({
        page,
        size: pageSize,
        search: search || undefined,
        categoryId: categoryId || undefined,
      }),
      publicBookCategoriesApi.list({ page: 1, size: 100 }),
    ]);

    if (!bookResponse.success || !Array.isArray(bookResponse.data?.data)) {
      error = bookResponse.message || "Could not load books.";
    } else {
      books = bookResponse.data.data;
      totalElements = bookResponse.data.totalElements;
      totalPages = Math.max(bookResponse.data.totalPage, 1);
    }

    if (categoryResponse.success && Array.isArray(categoryResponse.data?.data)) {
      categories = categoryResponse.data.data;
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Could not load books.";
  }

  return (
    <CartProvider>
      <main className={`${ptSerif.className} pb-16`} style={{ backgroundColor: catalogCanvas }}>
        <BooksCatalog
          books={books}
          categories={categories}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          search={search}
          categoryId={categoryId}
          error={error}
        />
        <div className="mt-16">
          <LandingFooter />
        </div>
      </main>
    </CartProvider>
  );
}

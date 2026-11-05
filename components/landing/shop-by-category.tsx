import Image from "next/image";
import { SectionHeading } from "@/components/landing/catalog-shared";
import type { BookCategory } from "@/core/book-categories/category";
import { publicBookCategoriesApi } from "@/infrastructure/book-categories/http-public-book-categories-api";

function coverSrc(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    if (url.protocol === "https:" && url.hostname === "res.cloudinary.com") return url.toString();
  } catch {
    return null;
  }
  return null;
}

async function loadCategories() {
  try {
    const response = await publicBookCategoriesApi.list({ page: 1, size: 100 });
    const rows = response.data?.data;
    if (!response.success || !Array.isArray(rows)) {
      return { items: [] as BookCategory[], error: response.message || "Could not load categories." };
    }
    return { items: rows, error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load categories.";
    return { items: [] as BookCategory[], error: message };
  }
}

export async function ShopByCategory() {
  const categories = await loadCategories();

  return (
    <section className="px-6 pt-12 pb-4 sm:px-10 lg:px-14" aria-labelledby="shop-by-category">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          id="shop-by-category"
          title="Shop by Category"
          subtitle="Whether you're seeking breakthrough, healing, wisdom, or direction"
          href="/books"
        />
        {categories.error ? <p className="mb-4 text-sm text-danger">{categories.error}</p> : null}
        {!categories.error && categories.items.length === 0 ? (
          <p className="text-sm text-[#8d939c]">No categories to show yet.</p>
        ) : null}
        <div id="categories" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.items.map((category) => {
            const image = coverSrc(category.imageUrl);
            return (
              <a
                key={category.id}
                href={`/books?categoryId=${encodeURIComponent(category.id)}`}
                className="group relative flex h-[158px] items-center justify-center overflow-hidden rounded-[18px] bg-[#14171a]"
              >
                {image ? (
                  <Image src={image} alt="" fill sizes="280px" className="object-cover object-center" />
                ) : null}
                <div className="absolute inset-0 bg-black/55 transition-colors group-hover:bg-black/45" />
                <h3 className="relative z-10 line-clamp-3 px-4 text-center text-[22px] leading-[1.2] font-semibold text-white">
                  {category.name}
                </h3>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

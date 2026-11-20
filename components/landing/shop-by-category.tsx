import { RevealSection } from "@/components/landing/reveal-section";
import { SectionHeading } from "@/components/landing/catalog-shared";
import type { BookCategory } from "@/core/book-categories/category";
import { publicBookCategoriesApi } from "@/infrastructure/book-categories/http-public-book-categories-api";

const categoryVideos = [
  "/animo-ticker-loop-720p.gif",
  "/animo-wheel-carousel-720p.gif",
] as const;

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
    <RevealSection
      id="collection"
      className="scroll-mt-8 px-6 pt-12 pb-4 sm:px-10 lg:px-14"
      aria-labelledby="shop-by-category"
    >
      <div className="w-full">
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
        <div
          id="categories"
          className="landing-stagger mr-auto grid w-full max-w-[1000px] gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.items.map((category, index) => (
            <a
              key={category.id}
              href={`/books?categoryId=${encodeURIComponent(category.id)}`}
              className="group relative flex h-[200px] items-center justify-center overflow-hidden rounded-[18px] bg-[#14171a] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,24,40,0.16)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-[220px]"
            >
              <img
                src={categoryVideos[index % categoryVideos.length]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-black/55 transition-colors duration-300 ease-out group-hover:bg-black/40" />
              <h3 className="relative z-10 line-clamp-3 px-4 text-center text-[22px] leading-[1.2] font-semibold text-white">
                {category.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

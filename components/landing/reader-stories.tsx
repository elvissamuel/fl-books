import Image from "next/image";
import { RevealSection } from "@/components/landing/reveal-section";
import { StarRating } from "@/components/landing/catalog-shared";
import type { PublicTestimonial } from "@/core/testimonials/public-api";
import { publicTestimonialsApi } from "@/infrastructure/testimonials/http-public-testimonials-api";

const fallbackAvatar = "/testimonials/avatar.jpg";

async function loadStories() {
  try {
    const response = await publicTestimonialsApi.list({ page: 1, size: 10 });
    const rows = response.data?.data;
    if (!response.success || !Array.isArray(rows)) {
      return { items: [] as PublicTestimonial[], error: response.message || "Could not load stories." };
    }
    return { items: rows.filter((story) => story.visible !== false), error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load stories.";
    return { items: [] as PublicTestimonial[], error: message };
  }
}

export async function ReaderStories() {
  const stories = await loadStories();

  return (
    <RevealSection className="px-6 pt-12 pb-16 sm:px-10 lg:px-14" aria-labelledby="reader-stories">
      <div className="landing-piece mx-auto max-w-[1180px]">
        <h2
          id="reader-stories"
          className="text-center text-[26px] font-semibold tracking-[-0.03em] text-[#1a1d21] sm:text-[30px]"
        >
          Words From Readers Whose Lives Were Marked
        </h2>
        <p className="mx-auto mt-2 max-w-[560px] text-center text-[14px] leading-6 text-[#8d939c]">
          Real stories from people who found clarity, courage, and change in these pages.
        </p>
      </div>
      {stories.error ? (
        <p className="mx-auto mt-8 max-w-[1180px] text-center text-sm text-danger">{stories.error}</p>
      ) : null}
      {!stories.error && stories.items.length === 0 ? (
        <p className="mx-auto mt-8 max-w-[1180px] text-center text-sm text-[#8d939c]">No stories to show yet.</p>
      ) : null}
      {stories.items.length > 0 ? (
        <div className="mt-8 overflow-x-auto">
          <div className="landing-stagger mx-auto flex w-max gap-4 px-6">
            {stories.items.map((story) => (
              <article
                key={story.id}
                className="w-[280px] shrink-0 rounded-[18px] bg-white p-5 shadow-[0_8px_24px_rgba(20,24,40,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,24,40,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[320px]"
              >
                <StarRating />
                <p className="mt-3 text-[14px] leading-6 text-[#3a3f46]">{story.message}</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <Image
                    src={story.imageUrl || fallbackAvatar}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="size-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-[#1c2433]">{story.name}</p>
                    <p className="text-[11.5px] text-[#8d939c]">{story.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </RevealSection>
  );
}

import Image from "next/image";
import { StarRating } from "@/components/landing/catalog-shared";

const stories = [
  {
    quote: "These pages met me tired and sent me back clearer than I arrived.",
    name: "Adaeze Nwosu",
    role: "Teacher",
  },
  {
    quote: "Possessing The Gates' shifted how I fight for what's mine. Practical and powerful.",
    name: "Jemima Johan",
    role: "Project Manger",
  },
  {
    quote: "Wedluck' should be required reading before every wedding. Life-changing.",
    name: "Ogunsakin David",
    role: "Founder, SME Startup",
  },
  {
    quote: "Scent Of Water' met me in my driest season and gave me language for hope again.",
    name: "Dr. Samson Oge",
    role: "Communication direction, Government Agency",
  },
  {
    quote: "I finished it in two nights and started the next morning differently.",
    name: "Tomi Adebayo",
    role: "Pastor",
  },
] as const;

export function ReaderStories() {
  return (
    <section className="px-6 pt-12 pb-16 sm:px-10 lg:overflow-hidden lg:px-14" aria-labelledby="reader-stories">
      <div className="mx-auto max-w-[1180px]">
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
      <div className="mt-8 overflow-x-auto lg:overflow-hidden">
        <div className="mx-auto flex w-max gap-4 px-6 lg:-ml-[270px] lg:w-full lg:max-w-[1360px] lg:px-0">
          {stories.map((story) => (
            <article
              key={story.name}
              className="w-[280px] shrink-0 rounded-[18px] bg-white p-5 shadow-[0_8px_24px_rgba(20,24,40,0.05)] sm:w-[320px]"
            >
              <StarRating />
              <p className="mt-3 text-[14px] leading-6 text-[#3a3f46]">{story.quote}</p>
              <div className="mt-4 flex items-center gap-2.5">
                <Image
                  src="/testimonials/avatar.jpg"
                  alt=""
                  width={32}
                  height={32}
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
    </section>
  );
}

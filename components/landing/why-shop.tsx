import { RevealSection } from "@/components/landing/reveal-section";

const reasons = [
  {
    number: "01",
    title: "Fast, Reliable Delivery",
    body: "Track your order from checkout to your doorstep",
  },
  {
    number: "02",
    title: "Secure Checkout, Any Currency",
    body: "Shop confidently in your local currency",
  },
  {
    number: "03",
    title: "100% Authentic Copies",
    body: "Every book sourced and verified directly",
  },
  {
    number: "04",
    title: "Real Reader Support",
    body: "A team that actually answers when you reach out",
  },
] as const;

export function WhyShop() {
  return (
    <RevealSection className="px-6 pt-16 pb-6 sm:px-10 lg:px-14" aria-labelledby="why-shop">
      <div className="mx-auto max-w-[1180px]">
        <div className="landing-piece">
          <h2
            id="why-shop"
            className="text-center text-[28px] font-semibold tracking-[-0.03em] text-[#1a1d21] sm:text-[32px]"
          >
            Why Shop With Us
          </h2>
          <p className="mx-auto mt-2 max-w-[640px] text-center text-[14px] leading-6 text-[#8d939c]">
            Every book, every order, every delivery, handled with the same care you&apos;ll find in the
            pages themselves.
          </p>
        </div>
        <div className="landing-stagger mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => (
            <article
              key={reason.number}
              className="relative h-[196px] overflow-hidden rounded-[18px] bg-white shadow-[0_8px_24px_rgba(20,24,40,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,24,40,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="absolute top-8 left-5 text-[100px] leading-none font-semibold tracking-[-0.04em] text-[#99aba9]">
                {reason.number}
              </p>
              <div className="absolute inset-x-0 top-[98px] bg-white px-5 pb-5 pt-5">
                <h3 className="text-[15px] font-semibold leading-snug text-[#1c1f24]">{reason.title}</h3>
                <p className="mt-1.5 text-[13px] leading-5 text-[#8d939c]">{reason.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

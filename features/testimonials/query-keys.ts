import type { TestimonialListParams } from "@/core/testimonials/types";

export const testimonialKeys = {
  all: ["testimonials"] as const,
  list: (params: TestimonialListParams) => [...testimonialKeys.all, "list", params] as const,
};

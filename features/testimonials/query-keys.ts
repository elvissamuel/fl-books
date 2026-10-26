import type { TestimonialListQuery } from "@/core/testimonials/private-api";
import type { TestimonialListParams } from "@/core/testimonials/types";

export const testimonialKeys = {
  all: ["testimonials"] as const,
  list: (params: TestimonialListParams) => [...testimonialKeys.all, "list", params] as const,
  privateList: (query: TestimonialListQuery) =>
    [...testimonialKeys.all, "private", query] as const,
  detail: (testimonialId: string) => [...testimonialKeys.all, "detail", testimonialId] as const,
};

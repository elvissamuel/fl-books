"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateTestimonialPayload, TestimonialListParams } from "@/core/testimonials/types";
import { testimonialKeys } from "@/features/testimonials/query-keys";
import { listTestimonials, testimonialsApi } from "@/infrastructure/testimonials/testimonials-api";

export function useTestimonials(params: TestimonialListParams) {
  return useQuery({
    queryKey: testimonialKeys.list(params),
    queryFn: () => testimonialsApi.list(params),
    placeholderData: listTestimonials(params),
  });
}

export function useCreateTestimonial() {
  return useMutation({
    mutationFn: (payload: CreateTestimonialPayload) => testimonialsApi.create(payload),
  });
}

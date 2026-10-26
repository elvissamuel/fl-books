"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { TestimonialListQuery, TestimonialWriteRequest } from "@/core/testimonials/private-api";
import type { CreateTestimonialPayload, TestimonialListParams } from "@/core/testimonials/types";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { testimonialKeys } from "@/features/testimonials/query-keys";
import { listTestimonials, testimonialsApi } from "@/infrastructure/testimonials/testimonials-api";
import {
  createPrivateTestimonial,
  deletePrivateTestimonial,
  getPrivateTestimonial,
  listPrivateTestimonials,
  updatePrivateTestimonial,
} from "@/infrastructure/testimonials/testimonials-actions";

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

export function usePrivateTestimonials(query: TestimonialListQuery) {
  return useQuery({
    queryKey: testimonialKeys.privateList(query),
    queryFn: async () => unwrapAction(await listPrivateTestimonials(query)),
  });
}

export function usePrivateTestimonial(testimonialId: string) {
  return useQuery({
    queryKey: testimonialKeys.detail(testimonialId),
    queryFn: async () => unwrapAction(await getPrivateTestimonial(testimonialId)),
    enabled: testimonialId.length > 0,
  });
}

export function useCreatePrivateTestimonial() {
  return useMutation({
    mutationFn: async (request: TestimonialWriteRequest) =>
      unwrapAction(await createPrivateTestimonial(request)),
  });
}

export function useUpdatePrivateTestimonial() {
  return useMutation({
    mutationFn: async ({
      testimonialId,
      request,
    }: {
      testimonialId: string;
      request: TestimonialWriteRequest;
    }) => unwrapAction(await updatePrivateTestimonial(testimonialId, request)),
  });
}

export function useDeletePrivateTestimonial() {
  return useMutation({
    mutationFn: async (testimonialId: string) =>
      unwrapAction(await deletePrivateTestimonial(testimonialId)),
  });
}

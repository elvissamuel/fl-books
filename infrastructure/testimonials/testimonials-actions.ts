"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type { TestimonialListQuery, TestimonialWriteRequest } from "@/core/testimonials/private-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privateTestimonialsApi } from "@/infrastructure/testimonials/http-testimonials-api";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; sessionExpired?: boolean };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    return unwrap(await task(opened.session.accessToken));
  } catch (error) {
    return adminActionFailure(error);
  }
}

function unwrap<T>(response: ApiResponse<T>): ActionResult<T> {
  if (!response.success || response.data == null) {
    return { ok: false, message: response.message || "Request failed." };
  }
  return { ok: true, data: response.data };
}

export async function listPrivateTestimonials(query: TestimonialListQuery) {
  return run((accessToken) => privateTestimonialsApi.list(query, accessToken));
}

export async function createPrivateTestimonial(request: TestimonialWriteRequest) {
  return run((accessToken) => privateTestimonialsApi.create(request, accessToken));
}

export async function getPrivateTestimonial(testimonialId: string) {
  return run((accessToken) => privateTestimonialsApi.get(testimonialId, accessToken));
}

export async function updatePrivateTestimonial(
  testimonialId: string,
  request: TestimonialWriteRequest,
) {
  return run((accessToken) => privateTestimonialsApi.update(testimonialId, request, accessToken));
}

export async function deletePrivateTestimonial(testimonialId: string) {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    const response = await privateTestimonialsApi.delete(testimonialId, opened.session.accessToken);
    if (!response.success) {
      return { ok: false as const, message: response.message || "Request failed." };
    }
    return { ok: true as const, data: response.data ?? response.message };
  } catch (error) {
    return adminActionFailure(error);
  }
}

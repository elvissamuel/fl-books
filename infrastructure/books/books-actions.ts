"use server";

import { unstable_rethrow } from "next/navigation";
import type { ApiResponse } from "@/core/auth/admin-api";
import type { BookListQuery, CreateBookRequest, UpdateBookRequest } from "@/core/books/private-api";
import { privateBooksApi } from "@/infrastructure/books/http-books-api";
import { requireAdminSession } from "@/infrastructure/auth/require-admin-session";
import { ApiError } from "@/infrastructure/http/api-client";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  try {
    const session = await requireAdminSession();
    return unwrap(await task(session.accessToken));
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "Request failed." };
  }
}

function unwrap<T>(response: ApiResponse<T>): ActionResult<T> {
  if (!response.success || response.data == null) {
    return { ok: false, message: response.message || "Request failed." };
  }
  return { ok: true, data: response.data };
}

export async function listPrivateBooks(query: BookListQuery) {
  return run((accessToken) => privateBooksApi.list(query, accessToken));
}

export async function createPrivateBook(request: CreateBookRequest) {
  return run((accessToken) => privateBooksApi.create(request, accessToken));
}

export async function getPrivateBook(bookId: string) {
  return run((accessToken) => privateBooksApi.get(bookId, accessToken));
}

export async function updatePrivateBook(bookId: string, request: UpdateBookRequest) {
  return run((accessToken) => privateBooksApi.update(bookId, request, accessToken));
}

export async function deletePrivateBook(bookId: string) {
  return run((accessToken) => privateBooksApi.delete(bookId, accessToken));
}

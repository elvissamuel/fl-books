"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type { BookListQuery, CreateBookRequest, UpdateBookRequest } from "@/core/books/private-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { privateBooksApi } from "@/infrastructure/books/http-books-api";

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

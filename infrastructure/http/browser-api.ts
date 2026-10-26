"use client";

import type { ApiResponse } from "@/core/auth/admin-api";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; sessionExpired?: boolean };

type BrowserApiOptions = {
  method?: string;
  json?: unknown;
  body?: BodyInit;
  headers?: HeadersInit;
  allowEmptyData?: boolean;
};

function failureMessage(body: unknown, path: string, status: number) {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
    const message = body.message.trim();
    if (message) return message;
  }

  if (typeof body === "string" && body.trim()) return body.trim();
  return `Request to ${path} failed (${status}).`;
}

export function setQuery(
  search: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined || value === "") return;
  search.set(key, String(value));
}

export function withSearch(path: string, search: URLSearchParams) {
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export async function browserApi<T>(
  path: string,
  options: BrowserApiOptions = {},
): Promise<ActionResult<T>> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);
  let body = options.body;

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  }

  try {
    const response = await fetch(path, {
      method,
      headers,
      body,
      credentials: "same-origin",
      cache: "no-store",
    });
    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = text;
      }
    }

    if (!response.ok) {
      const message = failureMessage(parsed, path, response.status);
      const sessionExpired =
        response.status === 401 &&
        parsed !== null &&
        typeof parsed === "object" &&
        "sessionExpired" in parsed &&
        parsed.sessionExpired === true;
      console.error("[api]", method, path, response.status, parsed);
      return sessionExpired ? { ok: false, message, sessionExpired: true } : { ok: false, message };
    }

    console.info("[api]", method, path, response.status, parsed);

    if (!parsed || typeof parsed !== "object" || !("success" in parsed)) {
      const message = `Request to ${path} returned an unexpected response.`;
      console.error("[api]", method, path, parsed);
      return { ok: false, message };
    }

    const payload = parsed as ApiResponse<T> & { sessionExpired?: boolean };
    if (!payload.success || (payload.data == null && !options.allowEmptyData)) {
      const message = payload.message || `Request to ${path} failed.`;
      console.error("[api]", method, path, payload);
      return { ok: false, message };
    }

    return { ok: true, data: payload.data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    console.error("[api]", method, path, message);
    return { ok: false, message };
  }
}

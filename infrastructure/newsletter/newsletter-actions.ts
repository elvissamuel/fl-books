"use client";

import type { NewsletterListQuery, PaginatedNewsletter, NewsletterSubscription } from "@/core/newsletter/private-api";
import type { SubscribeNewsletterRequest } from "@/core/newsletter/public-api";
import { browserApi, setQuery, withSearch, type ActionResult } from "@/infrastructure/http/browser-api";

const subscribe = "/api/v1/newsletter/public/subscribe";
const list = "/api/v1/newsletter/private";
const exportPath = "/api/v1/newsletter/private/export";

function listSearch(query: NewsletterListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  return search;
}

export async function subscribeNewsletter(request: SubscribeNewsletterRequest) {
  return browserApi<NewsletterSubscription>(subscribe, { method: "POST", json: request });
}

export async function listPrivateNewsletter(query: NewsletterListQuery) {
  return browserApi<PaginatedNewsletter>(withSearch(list, listSearch(query)));
}

function fileName(disposition: string | null, contentType: string) {
  const match = disposition?.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
  if (match?.[1]) return decodeURIComponent(match[1].replace(/"$/, ""));
  if (contentType.includes("sheet") || contentType.includes("excel")) return "newsletter.xlsx";
  if (contentType.includes("json")) return "newsletter.json";
  return "newsletter.csv";
}

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportPrivateNewsletter(): Promise<ActionResult<null>> {
  try {
    const response = await fetch(exportPath, { credentials: "same-origin", cache: "no-store" });
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("json")) {
      const parsed: unknown = await response.json().catch(() => null);
      const body =
        parsed && typeof parsed === "object" ? (parsed as { success?: boolean; message?: string; sessionExpired?: boolean; data?: unknown }) : null;
      if (!response.ok || body?.success === false || body?.sessionExpired) {
        return {
          ok: false,
          message: body?.message?.trim() || `Request to ${exportPath} failed (${response.status}).`,
          sessionExpired: body?.sessionExpired === true || response.status === 401,
        };
      }
      const fileUrl =
        typeof body?.data === "string"
          ? body.data
          : body?.data && typeof body.data === "object" && "url" in body.data && typeof body.data.url === "string"
            ? body.data.url
            : "";
      if (/^https?:\/\//.test(fileUrl)) {
        window.location.assign(fileUrl);
        return { ok: true, data: null };
      }
      saveFile(new Blob([JSON.stringify(body?.data ?? body)], { type: "application/json" }), "newsletter.json");
      return { ok: true, data: null };
    }

    if (!response.ok) {
      return { ok: false, message: `Request to ${exportPath} failed (${response.status}).` };
    }

    saveFile(await response.blob(), fileName(response.headers.get("content-disposition"), contentType));
    return { ok: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not export the newsletter.";
    return { ok: false, message };
  }
}

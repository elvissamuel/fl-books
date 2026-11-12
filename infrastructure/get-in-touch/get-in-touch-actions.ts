"use client";

import type {
  GetInTouchListQuery,
  GetInTouchMessage,
  GetInTouchWriteRequest,
  PaginatedGetInTouch,
} from "@/core/get-in-touch/private-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const create = "/api/v1/get-in-touch/public";
const list = "/api/v1/get-in-touch/private";
const byId = (messageId: string) => `/api/v1/get-in-touch/private/${encodeURIComponent(messageId)}`;

function listSearch(query: GetInTouchListQuery) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  setQuery(search, "email", query.email?.trim());
  return search;
}

export async function createPublicGetInTouch(request: GetInTouchWriteRequest) {
  return browserApi<GetInTouchMessage>(create, { method: "POST", json: request });
}

export async function listPrivateGetInTouch(query: GetInTouchListQuery) {
  return browserApi<PaginatedGetInTouch>(withSearch(list, listSearch(query)));
}

export async function getPrivateGetInTouch(messageId: string) {
  return browserApi<GetInTouchMessage>(byId(messageId));
}

export async function updatePrivateGetInTouch(messageId: string, request: GetInTouchWriteRequest) {
  return browserApi<GetInTouchMessage>(byId(messageId), { method: "PATCH", json: request });
}

export async function deletePrivateGetInTouch(messageId: string) {
  return browserApi<string>(byId(messageId), { method: "DELETE", allowEmptyData: true });
}

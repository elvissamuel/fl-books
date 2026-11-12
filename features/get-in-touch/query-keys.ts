import type { GetInTouchListQuery } from "@/core/get-in-touch/private-api";

export const getInTouchKeys = {
  all: ["get-in-touch"] as const,
  list: (query: GetInTouchListQuery) => [...getInTouchKeys.all, "list", query] as const,
};

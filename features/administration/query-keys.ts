import type { AdminListParams } from "@/core/administration/types";

export const administrationKeys = {
  all: ["administration"] as const,
  list: (params: AdminListParams) => [...administrationKeys.all, "list", params] as const,
};

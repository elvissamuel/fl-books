"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetInTouchListQuery } from "@/core/get-in-touch/private-api";
import { unwrapAction } from "@/features/auth/unwrap-action";
import { getInTouchKeys } from "@/features/get-in-touch/query-keys";
import { listPrivateGetInTouch } from "@/infrastructure/get-in-touch/get-in-touch-actions";

export function usePrivateGetInTouch(query: GetInTouchListQuery) {
  return useQuery({
    queryKey: getInTouchKeys.list(query),
    queryFn: async () => unwrapAction(await listPrivateGetInTouch(query)),
  });
}

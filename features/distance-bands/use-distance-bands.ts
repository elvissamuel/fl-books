"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DistanceBandWriteRequest } from "@/core/distance-bands/private-api";
import { distanceBandKeys } from "@/features/distance-bands/query-keys";
import { unwrapAction } from "@/features/auth/unwrap-action";
import {
  createPrivateDistanceBand,
  deletePrivateDistanceBand,
  getPrivateDistanceBand,
  listPrivateDistanceBands,
  updatePrivateDistanceBand,
} from "@/infrastructure/distance-bands/distance-bands-actions";

function useRefreshDistanceBands() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: distanceBandKeys.all });
}

export function usePrivateDistanceBands() {
  return useQuery({
    queryKey: distanceBandKeys.list(),
    queryFn: async () => unwrapAction(await listPrivateDistanceBands()),
  });
}

export function usePrivateDistanceBand(bandId: string) {
  return useQuery({
    queryKey: distanceBandKeys.detail(bandId),
    queryFn: async () => unwrapAction(await getPrivateDistanceBand(bandId)),
    enabled: bandId.length > 0,
  });
}

export function useCreatePrivateDistanceBand() {
  const refresh = useRefreshDistanceBands();
  return useMutation({
    mutationFn: async (request: DistanceBandWriteRequest) =>
      unwrapAction(await createPrivateDistanceBand(request)),
    onSuccess: refresh,
  });
}

export function useUpdatePrivateDistanceBand() {
  const refresh = useRefreshDistanceBands();
  return useMutation({
    mutationFn: async ({
      bandId,
      request,
    }: {
      bandId: string;
      request: DistanceBandWriteRequest;
    }) => unwrapAction(await updatePrivateDistanceBand(bandId, request)),
    onSuccess: refresh,
  });
}

export function useDeletePrivateDistanceBand() {
  const refresh = useRefreshDistanceBands();
  return useMutation({
    mutationFn: async (bandId: string) => unwrapAction(await deletePrivateDistanceBand(bandId)),
    onSuccess: refresh,
  });
}

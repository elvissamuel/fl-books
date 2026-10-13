"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateDeliveryOutletPayload,
  DeliveryOutletListParams,
  PickupStationListParams,
} from "@/core/pickup-stations/types";
import { pickupStationKeys } from "@/features/pickup-stations/query-keys";
import {
  deliveryOutletsApi,
  listDeliveryOutlets,
  listPickupStations,
  pickupStationsApi,
} from "@/infrastructure/pickup-stations/pickup-stations-api";

export function usePickupStations(params: PickupStationListParams, enabled = true) {
  return useQuery({
    queryKey: pickupStationKeys.list(params),
    queryFn: () => pickupStationsApi.list(params),
    placeholderData: listPickupStations(params),
    enabled,
  });
}

export function useDeliveryOutlets(params: DeliveryOutletListParams, enabled = true) {
  return useQuery({
    queryKey: pickupStationKeys.outlets(params),
    queryFn: () => deliveryOutletsApi.list(params),
    placeholderData: listDeliveryOutlets(params),
    enabled,
  });
}

export function useCreateDeliveryOutlet() {
  return useMutation({
    mutationFn: (payload: CreateDeliveryOutletPayload) => deliveryOutletsApi.create(payload),
  });
}

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  DeliveryOutletFilterQuery,
  DeliveryOutletListQuery,
  DeliveryOutletStatus,
  DeliveryOutletWriteRequest,
} from "@/core/pickup-stations/delivery-outlet-api";
import type {
  CreatePickupLocationRequest,
  PickupLocationFilterQuery,
  PickupLocationListQuery,
  PickupLocationStatus,
  UpdatePickupLocationRequest,
} from "@/core/pickup-stations/private-api";
import type {
  CreateDeliveryOutletPayload,
  DeliveryOutletListParams,
  PickupStationListParams,
} from "@/core/pickup-stations/types";
import { pickupStationKeys } from "@/features/pickup-stations/query-keys";
import { unwrapAction } from "@/features/auth/unwrap-action";
import type { ActionResult } from "@/infrastructure/http/browser-api";
import {
  deliveryOutletsApi,
  listDeliveryOutlets,
  listPickupStations,
  pickupStationsApi,
} from "@/infrastructure/pickup-stations/pickup-stations-api";
import {
  createPrivateDeliveryOutlet,
  deletePrivateDeliveryOutlet,
  filterPrivateDeliveryOutlets,
  getPrivateDeliveryOutlet,
  getPrivateDeliveryOutletStatistics,
  listPrivateDeliveryOutlets,
  updatePrivateDeliveryOutlet,
  updatePrivateDeliveryOutletStatus,
} from "@/infrastructure/pickup-stations/delivery-outlets-actions";
import {
  createPrivatePickupLocation,
  deletePrivatePickupLocation,
  filterPrivatePickupLocations,
  getPrivatePickupLocation,
  getPrivatePickupLocationStatistics,
  listPrivatePickupLocations,
  updatePrivatePickupLocation,
  updatePrivatePickupLocationStatus,
} from "@/infrastructure/pickup-stations/pickup-locations-actions";

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

export function usePrivatePickupLocations(query: PickupLocationListQuery, enabled = true) {
  return useQuery({
    queryKey: pickupStationKeys.privateList(query),
    queryFn: async () => unwrapAction(await listPrivatePickupLocations(query)),
    enabled,
  });
}

export function useFilteredPickupLocations(query: PickupLocationFilterQuery) {
  return useQuery({
    queryKey: pickupStationKeys.privateFilter(query),
    queryFn: async () => unwrapAction(await filterPrivatePickupLocations(query)),
  });
}

export function usePrivatePickupLocation(locationId: string) {
  return useQuery({
    queryKey: pickupStationKeys.detail(locationId),
    queryFn: async () => unwrapAction(await getPrivatePickupLocation(locationId)),
    enabled: locationId.length > 0,
  });
}

export function usePickupLocationStatistics(enabled = true) {
  return useQuery({
    queryKey: pickupStationKeys.statistics(),
    queryFn: async () => unwrapAction(await getPrivatePickupLocationStatistics()),
    enabled,
  });
}

async function responseWithMessage<T>(result: Promise<ActionResult<T>>) {
  const settled = await result;
  if (!settled.ok) {
    if (settled.sessionExpired) {
      window.location.assign("/admin/login");
      return new Promise<never>(() => {});
    }
    throw new Error(settled.message);
  }
  return settled;
}

export function useCreatePrivatePickupLocation() {
  return useMutation({
    mutationFn: (request: CreatePickupLocationRequest) =>
      responseWithMessage(createPrivatePickupLocation(request)),
  });
}

export function useUpdatePrivatePickupLocation() {
  return useMutation({
    mutationFn: ({
      locationId,
      request,
    }: {
      locationId: string;
      request: UpdatePickupLocationRequest;
    }) => responseWithMessage(updatePrivatePickupLocation(locationId, request)),
  });
}

export function useUpdatePrivatePickupLocationStatus() {
  return useMutation({
    mutationFn: async ({
      locationId,
      status,
    }: {
      locationId: string;
      status: PickupLocationStatus;
    }) => unwrapAction(await updatePrivatePickupLocationStatus(locationId, status)),
  });
}

export function useDeletePrivatePickupLocation() {
  return useMutation({
    mutationFn: (locationId: string) => responseWithMessage(deletePrivatePickupLocation(locationId)),
  });
}

export function usePrivateDeliveryOutlets(query: DeliveryOutletListQuery, enabled = true) {
  return useQuery({
    queryKey: pickupStationKeys.outletList(query),
    queryFn: async () => unwrapAction(await listPrivateDeliveryOutlets(query)),
    enabled,
  });
}

export function useFilteredDeliveryOutlets(query: DeliveryOutletFilterQuery) {
  return useQuery({
    queryKey: pickupStationKeys.outletFilter(query),
    queryFn: async () => unwrapAction(await filterPrivateDeliveryOutlets(query)),
  });
}

export function usePrivateDeliveryOutlet(outletId: string) {
  return useQuery({
    queryKey: pickupStationKeys.outletDetail(outletId),
    queryFn: async () => unwrapAction(await getPrivateDeliveryOutlet(outletId)),
    enabled: outletId.length > 0,
  });
}

export function useDeliveryOutletStatistics(enabled = true) {
  return useQuery({
    queryKey: pickupStationKeys.outletStatistics(),
    queryFn: async () => unwrapAction(await getPrivateDeliveryOutletStatistics()),
    enabled,
  });
}

export function useCreatePrivateDeliveryOutlet() {
  return useMutation({
    mutationFn: (request: DeliveryOutletWriteRequest) =>
      responseWithMessage(createPrivateDeliveryOutlet(request)),
  });
}

export function useUpdatePrivateDeliveryOutlet() {
  return useMutation({
    mutationFn: ({
      outletId,
      request,
    }: {
      outletId: string;
      request: DeliveryOutletWriteRequest;
    }) => responseWithMessage(updatePrivateDeliveryOutlet(outletId, request)),
  });
}

export function useUpdatePrivateDeliveryOutletStatus() {
  return useMutation({
    mutationFn: async ({ outletId, status }: { outletId: string; status: DeliveryOutletStatus }) =>
      unwrapAction(await updatePrivateDeliveryOutletStatus(outletId, status)),
  });
}

export function useDeletePrivateDeliveryOutlet() {
  return useMutation({
    mutationFn: (outletId: string) => responseWithMessage(deletePrivateDeliveryOutlet(outletId)),
  });
}

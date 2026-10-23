import type {
  DeliveryOutletFilterQuery,
  DeliveryOutletListQuery,
} from "@/core/pickup-stations/delivery-outlet-api";
import type {
  PickupLocationFilterQuery,
  PickupLocationListQuery,
} from "@/core/pickup-stations/private-api";
import type {
  DeliveryOutletListParams,
  PickupStationListParams,
} from "@/core/pickup-stations/types";

export const pickupStationKeys = {
  all: ["pickup-stations"] as const,
  list: (params: PickupStationListParams) =>
    [...pickupStationKeys.all, "list", params] as const,
  outlets: (params: DeliveryOutletListParams) =>
    [...pickupStationKeys.all, "outlets", params] as const,
  privateList: (query: PickupLocationListQuery) =>
    [...pickupStationKeys.all, "private", query] as const,
  privateFilter: (query: PickupLocationFilterQuery) =>
    [...pickupStationKeys.all, "filter", query] as const,
  detail: (locationId: string) => [...pickupStationKeys.all, "detail", locationId] as const,
  statistics: () => [...pickupStationKeys.all, "statistics"] as const,
  outletList: (query: DeliveryOutletListQuery) =>
    [...pickupStationKeys.all, "outlet-list", query] as const,
  outletFilter: (query: DeliveryOutletFilterQuery) =>
    [...pickupStationKeys.all, "outlet-filter", query] as const,
  outletDetail: (outletId: string) => [...pickupStationKeys.all, "outlet", outletId] as const,
  outletStatistics: () => [...pickupStationKeys.all, "outlet-statistics"] as const,
};

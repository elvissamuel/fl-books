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
};

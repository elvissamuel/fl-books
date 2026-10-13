export type PickupStationStatus = "active" | "inactive";

export type PickupStationFilter = "all" | "active" | "inactive";

export type PickupStationTab = "pickup" | "delivery";

export type PickupStation = {
  id: string;
  country: string;
  address: string;
  city: string;
  state: string;
  deliveryFeeLabel: string;
  contact: string;
  status: PickupStationStatus;
};

export type PickupStationSummary = {
  total: number;
  active: number;
  inactive: number;
};

export type PickupStationListParams = {
  search: string;
  filter: PickupStationFilter;
  tab: PickupStationTab;
  page: number;
  pageSize: number;
};

export type PickupStationListPage = {
  items: PickupStation[];
  summary: PickupStationSummary;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export interface PickupStationsApi {
  list(params: PickupStationListParams): Promise<PickupStationListPage>;
}

export type WeightPriceBracket = {
  id: string;
  label: string;
  price: number;
};

export type DeliveryOutlet = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  phone: string;
  email: string;
  status: PickupStationStatus;
  brackets: WeightPriceBracket[];
};

export type DeliveryOutletListParams = {
  search: string;
  filter: PickupStationFilter;
  page: number;
  pageSize: number;
};

export type DeliveryOutletListPage = {
  items: DeliveryOutlet[];
  summary: PickupStationSummary;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type DeliveryOutletWeightRangeInput = {
  serialNumber: number;
  minKg: number;
  maxKg: number;
  price: number;
};

export type CreateDeliveryOutletPayload = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactName: string;
  phone: string;
  email: string;
  status: PickupStationStatus;
  weightRanges: DeliveryOutletWeightRangeInput[];
};

export interface DeliveryOutletsApi {
  list(params: DeliveryOutletListParams): Promise<DeliveryOutletListPage>;
  create(payload: CreateDeliveryOutletPayload): Promise<DeliveryOutlet>;
}

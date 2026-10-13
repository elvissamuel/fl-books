import type {
  CreateDeliveryOutletPayload,
  DeliveryOutlet,
  DeliveryOutletListPage,
  DeliveryOutletListParams,
  DeliveryOutletsApi,
  PickupStation,
  PickupStationListPage,
  PickupStationListParams,
  PickupStationStatus,
  PickupStationsApi,
  PickupStationSummary,
  WeightPriceBracket,
} from "@/core/pickup-stations/types";

const pageSize = 8;
const totalPages = 17;
const screenshotPage = 4;

const screenshotStation = {
  country: "Nigeria",
  address: "14 Allen avenue, Ikeja",
  city: "Port Hacourt",
  state: "Rivers State",
  deliveryFeeLabel: "N5000",
  contact: "08107355412",
} as const satisfies Omit<PickupStation, "id" | "status">;

const screenshotStatuses: PickupStationStatus[] = [
  "active",
  "inactive",
  "inactive",
  "active",
  "active",
  "active",
  "active",
  "inactive",
];

const pickupSummary: PickupStationSummary = {
  total: 50,
  active: 30,
  inactive: 20,
};

function createCatalog(): PickupStation[] {
  return Array.from({ length: pageSize * totalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (screenshotPage - 1) * pageSize && index < screenshotPage * pageSize;
    const row = index % pageSize;

    return {
      ...screenshotStation,
      id: `station-${index + 1}`,
      city: onScreenshotPage ? screenshotStation.city : `City ${index + 1}`,
      status: onScreenshotPage
        ? screenshotStatuses[row]
        : index % 3 === 0
          ? "inactive"
          : "active",
    };
  });
}

const catalog = createCatalog();

export const defaultPickupStationListParams: PickupStationListParams = {
  search: "",
  filter: "all",
  tab: "pickup",
  page: screenshotPage,
  pageSize,
};

const outletPageSize = 6;
const outletTotalPages = 17;
const outletScreenshotPage = 4;

const screenshotBrackets: WeightPriceBracket[] = [
  { id: "0-2", label: "0kg - 2kg", price: 1500 },
  { id: "2-5", label: "2kg - 5kg", price: 2500 },
  { id: "5-8", label: "5kg - 8kg", price: 3500 },
  { id: "8-10", label: "8kg - 10kg", price: 4500 },
];

const screenshotOutlet = {
  name: "GIG Logistics Outlet - Ikeja Commercial Hub",
  address: "12 Ademola hopewell St, Victoria Island, Nigeria",
  city: "Abuja",
  state: "FCT Abuja",
  country: "Nigeria",
  contactName: "David Amos",
  phone: "+2349086726521",
  email: "Davidamos@gmail.com",
} as const satisfies Omit<DeliveryOutlet, "id" | "status" | "brackets">;

function createOutletCatalog(): DeliveryOutlet[] {
  return Array.from({ length: outletPageSize * outletTotalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (outletScreenshotPage - 1) * outletPageSize &&
      index < outletScreenshotPage * outletPageSize;

    return {
      ...screenshotOutlet,
      id: `outlet-${index + 1}`,
      name: onScreenshotPage ? screenshotOutlet.name : `GIG Logistics Outlet ${index + 1}`,
      city: onScreenshotPage ? screenshotOutlet.city : `City ${index + 1}`,
      email: onScreenshotPage ? screenshotOutlet.email : `outlet${index + 1}@gmail.com`,
      status: onScreenshotPage || index % 4 !== 0 ? "active" : "inactive",
      brackets: screenshotBrackets,
    };
  });
}

const outletCatalog = createOutletCatalog();

export const defaultDeliveryOutletListParams: DeliveryOutletListParams = {
  search: "",
  filter: "all",
  page: outletScreenshotPage,
  pageSize: outletPageSize,
};

export function listDeliveryOutlets(params: DeliveryOutletListParams): DeliveryOutletListPage {
  const search = params.search.trim().toLowerCase();
  let items = outletCatalog.filter((outlet) => {
    if (!search) return true;
    return (
      outlet.name.toLowerCase().includes(search) ||
      outlet.address.toLowerCase().includes(search) ||
      outlet.city.toLowerCase().includes(search) ||
      outlet.state.toLowerCase().includes(search) ||
      outlet.country.toLowerCase().includes(search) ||
      outlet.contactName.toLowerCase().includes(search) ||
      outlet.phone.toLowerCase().includes(search) ||
      outlet.email.toLowerCase().includes(search)
    );
  });

  if (params.filter === "active" || params.filter === "inactive") {
    items = items.filter((outlet) => outlet.status === params.filter);
  }

  const totalCount = items.length;
  const pages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const page = Math.min(Math.max(params.page, 1), pages);
  const start = (page - 1) * params.pageSize;

  return {
    items: items.slice(start, start + params.pageSize),
    summary: pickupSummary,
    page,
    pageSize: params.pageSize,
    totalPages: pages,
    totalCount,
  };
}

export const deliveryOutletEndpoints = {
  list: (params: DeliveryOutletListParams) => {
    const search = new URLSearchParams({
      search: params.search,
      filter: params.filter,
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/delivery-outlets?${search.toString()}`;
  },
  create: "/api/admin/delivery-outlets",
};

export function createDeliveryOutlet(payload: CreateDeliveryOutletPayload): DeliveryOutlet {
  return {
    id: `outlet-${payload.name.trim().toLowerCase().replace(/\s+/g, "-") || "new"}`,
    name: payload.name,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    country: payload.country,
    contactName: payload.contactName,
    phone: payload.phone,
    email: payload.email,
    status: payload.status,
    brackets: payload.weightRanges.map((range) => ({
      id: String(range.serialNumber),
      label: `${range.minKg}kg - ${range.maxKg}kg`,
      price: range.price,
    })),
  };
}

export const deliveryOutletsApi: DeliveryOutletsApi = {
  async list(params) {
    return listDeliveryOutlets(params);
  },
  async create(payload) {
    return createDeliveryOutlet(payload);
  },
};

export function listPickupStations(params: PickupStationListParams): PickupStationListPage {
  const search = params.search.trim().toLowerCase();
  let items = catalog.filter((station) => {
    if (!search) return true;
    return (
      station.country.toLowerCase().includes(search) ||
      station.address.toLowerCase().includes(search) ||
      station.city.toLowerCase().includes(search) ||
      station.state.toLowerCase().includes(search) ||
      station.contact.includes(search)
    );
  });

  if (params.filter === "active" || params.filter === "inactive") {
    items = items.filter((station) => station.status === params.filter);
  }

  const totalCount = items.length;
  const pages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const page = Math.min(Math.max(params.page, 1), pages);
  const start = (page - 1) * params.pageSize;

  return {
    items: items.slice(start, start + params.pageSize),
    summary: pickupSummary,
    page,
    pageSize: params.pageSize,
    totalPages: pages,
    totalCount,
  };
}

export const pickupStationEndpoints = {
  list: (params: PickupStationListParams) => {
    const search = new URLSearchParams({
      search: params.search,
      filter: params.filter,
      tab: params.tab,
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/pickup-stations?${search.toString()}`;
  },
};

export const pickupStationsApi: PickupStationsApi = {
  async list(params) {
    return listPickupStations(params);
  },
};

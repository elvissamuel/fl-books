import type {
  Order,
  OrderDetail,
  OrderFulfillment,
  OrderListPage,
  OrderListParams,
  OrderStatus,
  OrdersApi,
} from "@/core/orders/types";

const pageSize = 8;
const totalPages = 17;
const screenshotPage = 4;

const screenshotOrders: Pick<Order, "type" | "status">[] = [
  { type: "Delivery", status: "shipped" },
  { type: "Delivery", status: "processing" },
  { type: "Delivery", status: "delivered" },
  { type: "Pickup", status: "failed" },
  { type: "Delivery", status: "shipped" },
  { type: "Delivery", status: "processing" },
  { type: "Delivery", status: "processing" },
  { type: "Delivery", status: "processing" },
];

const laterStatuses: OrderStatus[] = ["shipped", "processing", "delivered", "failed"];
const laterTypes: OrderFulfillment[] = ["Delivery", "Pickup"];

function createCatalog(): Order[] {
  return Array.from({ length: pageSize * totalPages }, (_, index) => {
    const onScreenshotPage =
      index >= (screenshotPage - 1) * pageSize && index < screenshotPage * pageSize;
    const shot = screenshotOrders[index % pageSize];

    return {
      id: `order-${index + 1}`,
      orderId: onScreenshotPage
        ? "ORD-0092"
        : `ORD-${String(80 + (index % 20)).padStart(4, "0")}`,
      customer: "Adebayo Johnson",
      type: onScreenshotPage ? shot.type : laterTypes[index % laterTypes.length],
      amount: 15000,
      bookType: "Be different",
      price: 6500,
      quantity: 4,
      status: onScreenshotPage ? shot.status : laterStatuses[index % laterStatuses.length],
    };
  });
}

const catalog = createCatalog();

export const defaultOrderListParams: OrderListParams = {
  search: "",
  filter: "all",
  page: screenshotPage,
  pageSize: 8,
};

export function listOrders(params: OrderListParams): OrderListPage {
  const search = params.search.trim().toLowerCase();
  let items = catalog.filter((order) => {
    if (!search) return true;
    return (
      order.orderId.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.bookType.toLowerCase().includes(search)
    );
  });

  if (params.filter === "pickup" || params.filter === "delivery") {
    const type = params.filter === "pickup" ? "Pickup" : "Delivery";
    items = items.filter((order) => order.type === type);
  } else if (params.filter === "active") {
    items = items.filter((order) => order.status !== "failed");
  } else if (params.filter === "inactive") {
    items = items.filter((order) => order.status === "failed");
  }

  const totalCount = items.length;
  const pages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const page = Math.min(Math.max(params.page, 1), pages);
  const start = (page - 1) * params.pageSize;

  return {
    items: items.slice(start, start + params.pageSize),
    page,
    pageSize: params.pageSize,
    totalPages: pages,
    totalCount,
  };
}

const screenshotOrderDetail: OrderDetail = {
  orderNumber: "#00057844",
  status: "Pending",
  quantity: 4,
  weightLabel: "0.4 kg",
  paymentMethod: "Transfer",
  orderedOn: "23 May 2026",
  email: "thankimedia@gmail.com",
  phone: "08107355412",
  lines: [
    {
      id: "line-1",
      title: "Be Different",
      unitPrice: 15000,
      quantity: 2,
      lineTotal: 30000,
    },
    {
      id: "line-2",
      title: "Be Different",
      unitPrice: 15000,
      quantity: 2,
      lineTotal: 30000,
    },
  ],
  subtotal: 30000,
  deliveryFee: 30000,
  grandTotal: 30000,
  city: "City: Victoria Island, Lagos State.",
  address: "12 Ademola hopewell St, Victoria Island, Nigeria",
};

export function getOrderDetail(_id: string): OrderDetail {
  return screenshotOrderDetail;
}

export const ordersEndpoints = {
  list: (params: OrderListParams) => {
    const search = new URLSearchParams({
      search: params.search,
      filter: params.filter,
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    return `/api/admin/orders?${search.toString()}`;
  },
  detail: (id: string) => `/api/admin/orders/${id}`,
};

export const ordersApi: OrdersApi = {
  async list(params) {
    return listOrders(params);
  },
  async get(id) {
    return getOrderDetail(id);
  },
};

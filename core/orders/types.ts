export type OrderFulfillment = "Delivery" | "Pickup";

export type OrderStatus = "shipped" | "processing" | "delivered" | "failed";

export type OrderListFilter = "all" | "pickup" | "delivery" | "active" | "inactive";

export type Order = {
  id: string;
  orderId: string;
  customer: string;
  type: OrderFulfillment;
  amount: number;
  bookType: string;
  price: number;
  quantity: number;
  status: OrderStatus;
};

export type OrderListParams = {
  search: string;
  filter: OrderListFilter;
  page: number;
  pageSize: number;
};

export type OrderListPage = {
  items: Order[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export type OrderDetailStatus = "Pending" | "Shipped" | "Processing" | "Delivered" | "Failed";

export type OrderLine = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDetail = {
  orderNumber: string;
  status: OrderDetailStatus;
  quantity: number;
  weightLabel: string;
  paymentMethod: string;
  orderedOn: string;
  email: string;
  phone: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  city: string;
  address: string;
};

export interface OrdersApi {
  list(params: OrderListParams): Promise<OrderListPage>;
  get(id: string): Promise<OrderDetail>;
}

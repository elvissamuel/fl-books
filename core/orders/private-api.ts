import type { ApiResponse } from "@/core/auth/admin-api";
import type { PublicBook } from "@/core/books/public-api";
import type {
  PaymentBook,
  PaymentProvider,
  PaymentStatus,
  PaymentUser,
  PaymentVerifiedBy,
  VerifyPaymentResult,
} from "@/core/payments/private-api";
import type { PickupLocation } from "@/core/pickup-stations/private-api";

export const fulfilmentStatuses = [
  "ORDER_PLACED",
  "PACKAGING",
  "SHIPPED",
  "IN_TRANSIT",
  "READY_FOR_PICKUP",
  "READY_FOR_DELIVERY",
  "DELIVERED",
] as const;

export type FulfilmentStatus = (typeof fulfilmentStatuses)[number];

export const deliveryStatuses = [
  "PACKAGING",
  "SHIPPED",
  "IN_TRANSIT",
  "READY_FOR_PICKUP",
  "DELIVERED",
] as const;

export type DeliveryStatus = (typeof deliveryStatuses)[number];

export const logisticsTypes = ["DELIVERY", "PICKUP", "PICK_UP", ...deliveryStatuses] as const;

export type LogisticsType = (typeof logisticsTypes)[number];

export type OrderFilterRequest = {
  page: number;
  size: number;
  search?: string;
  orderId?: string;
  userId?: string;
  pickUpLocationId?: string;
  paymentStatus?: PaymentStatus;
  logisticsType?: LogisticsType;
  fulfilmentStatus?: FulfilmentStatus;
  paymentProvider?: string;
  paymentReference?: string;
  createdFrom?: string;
  createdTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortDirection?: string;
};

export type CheckoutOrderRequest = {
  userId: string;
  pickUpLocationId: string;
  paymentClientServiceType: PaymentProvider;
  recipientName: string;
  recipientPhone: string;
  logisticsType: LogisticsType;
  sameAsMe: boolean;
  currencyId: string;
};

export type CalculateOrderRequest = {
  orderId: string;
  pickUpDeliveryLocationId: string;
  logisticsType: LogisticsType;
};

export type UpdateFulfilmentStatusRequest = {
  status: FulfilmentStatus;
};

export type FulfilmentStatusResult = {
  orderId: string;
  fulfilmentStatus: FulfilmentStatus;
  updatedAt: string;
};

export type CancelOrderRequest = {
  reason: string;
};

export type OrderCancellation = {
  orderId: string;
  orderReference: string;
  fulfilmentStatus: FulfilmentStatus;
  cancellationStatus: string;
  reason: string;
  requestedByUserId: string;
  requestedAt: string;
  reviewedByUserId: string;
  reviewedAt: string;
  stockRestoredAt: string;
};

export type OrderCalculation = {
  totalBookPrice: number;
  weightSurChargePrice: number;
  totalTaxPrice: number;
  totalAmount: number;
};

export type CheckoutOrder = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  paymentStatus: PaymentStatus;
  checkoutDetails: Record<string, string>;
  pickUpLocationId: string;
  totalWeightAmount: number;
  totalWeight: number;
  totalTaxPrice: number;
  totalAmount: number;
  totalBookPrice: number;
  recipientName: string;
  recipientPhone: string;
  logisticsType: LogisticsType;
};

export type CheckoutOrderResult = {
  payment: VerifyPaymentResult;
  books: PublicBook[];
  order: CheckoutOrder;
  calculate: OrderCalculation;
};

export type OrderPaymentSummary = {
  id: number;
  reference: string;
  provider: string;
  status: PaymentStatus;
  amount: number;
  currencyCode: string;
  verifiedBy: PaymentVerifiedBy;
  createdAt: string;
  modifiedAt: string;
};

export type PrivateOrder = {
  id: string;
  orderReference: string | null;
  userId: string;
  user: PaymentUser;
  paymentStatus: PaymentStatus;
  logisticsType: LogisticsType;
  fulfilmentStatus?: FulfilmentStatus | null;
  pickUpLocationId: string;
  recipientName: string;
  recipientPhone: string;
  currencyCode: string;
  totalBookPrice: number;
  totalWeightAmount: number;
  totalWeight: number;
  totalTaxPrice: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  pickupLocation: PickupLocation | null;
  books: PaymentBook[] | null;
  payments: OrderPaymentSummary[] | null;
};

export type PaginatedOrders = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: PrivateOrder[];
};

export interface PrivateOrdersApi {
  checkout(request: CheckoutOrderRequest, accessToken: string): Promise<ApiResponse<CheckoutOrderResult>>;
  filterCustomer(request: OrderFilterRequest, accessToken: string): Promise<ApiResponse<PaginatedOrders>>;
  filter(request: OrderFilterRequest, accessToken: string): Promise<ApiResponse<PaginatedOrders>>;
  calculate(request: CalculateOrderRequest, accessToken: string): Promise<ApiResponse<OrderCalculation>>;
  list(query: OrderFilterRequest, accessToken: string): Promise<ApiResponse<PaginatedOrders>>;
  get(orderId: string, accessToken: string): Promise<ApiResponse<PrivateOrder>>;
  updateFulfilmentStatus(
    orderId: string,
    request: UpdateFulfilmentStatusRequest,
    accessToken: string,
  ): Promise<ApiResponse<FulfilmentStatusResult>>;
  cancel(
    orderId: string,
    request: CancelOrderRequest,
    accessToken: string,
  ): Promise<ApiResponse<OrderCancellation>>;
  listCustomer(query: OrderFilterRequest, accessToken: string): Promise<ApiResponse<PaginatedOrders>>;
  getCustomer(orderId: string, accessToken: string): Promise<ApiResponse<PrivateOrder>>;
}

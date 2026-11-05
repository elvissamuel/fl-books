import type { ApiResponse } from "@/core/auth/admin-api";
import type { PickupLocation } from "@/core/pickup-stations/private-api";

export const paymentProviders = ["FLUTTERWAVE", "PAYSTACK"] as const;

export type PaymentProvider = (typeof paymentProviders)[number];

export const paymentStatuses = ["SUCCESS", "PENDING"] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentTypes = ["BOOK_PURCHASE"] as const;

export type PaymentType = (typeof paymentTypes)[number];

export const paymentVerifiedBy = ["MANUAL_VERIFICATION_METHOD"] as const;

export type PaymentVerifiedBy = (typeof paymentVerifiedBy)[number];

export type PaymentFilterRequest = {
  page: number;
  size: number;
  search?: string;
  paymentId?: number;
  reference?: string;
  orderId?: string;
  userId?: string;
  bookId?: string;
  provider?: PaymentProvider;
  status?: PaymentStatus;
  paymentType?: PaymentType;
  verifiedBy?: PaymentVerifiedBy;
  currencyCode?: string;
  currencyRateId?: string;
  minAmount?: number;
  maxAmount?: number;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  sortDirection?: string;
};

export type PaymentUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
};

export type PaymentOrder = {
  id: string;
  paymentStatus: PaymentStatus;
  logisticsType: string;
  recipientName: string;
  recipientPhone: string;
  pickUpLocationId: string;
  totalBookPrice: number;
  totalWeightAmount: number;
  totalWeight: number;
  totalTaxPrice: number;
  totalAmount: number;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentBook = {
  id: string;
  quantity: number;
  title: string;
  authorName: string;
  coverImageUrls: string[];
  currentCatalogPrice: number;
  catalogRecordFound: boolean;
};

export type Payment = {
  id: number;
  reference: string;
  orderId: string;
  userId: string;
  user: PaymentUser;
  provider: string;
  status: PaymentStatus;
  paymentType: PaymentType;
  verifiedBy: PaymentVerifiedBy;
  amount: number;
  currencyCode: string;
  currencyRateId: string;
  createdAt: string;
  modifiedAt: string;
  order: PaymentOrder;
  pickupLocation: PickupLocation;
  books: PaymentBook[];
};

export type PaginatedPayments = {
  totalPage: number;
  numberOfElements: number;
  totalElements: number;
  data: Payment[];
};

export type VerifyPaymentRequest = {
  transactionId: string;
  reference: string;
  iswebhook: boolean;
  signature: string;
  payload: Record<string, string>;
  paymentClientServiceType: PaymentProvider;
};

export type VerifyPaymentResult = {
  status: string;
  message: string;
  authorizationUrl: string;
  reference: string;
  paymentId: number;
};

export interface PrivatePaymentsApi {
  filterCustomer(
    request: PaymentFilterRequest,
    accessToken: string,
  ): Promise<ApiResponse<PaginatedPayments>>;
  filter(request: PaymentFilterRequest, accessToken: string): Promise<ApiResponse<PaginatedPayments>>;
  verify(request: VerifyPaymentRequest, accessToken: string): Promise<ApiResponse<VerifyPaymentResult>>;
  list(query: PaymentFilterRequest, accessToken: string): Promise<ApiResponse<PaginatedPayments>>;
  get(paymentId: number | string, accessToken: string): Promise<ApiResponse<Payment>>;
}

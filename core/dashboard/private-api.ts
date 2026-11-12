import type { ApiResponse } from "@/core/auth/admin-api";

export type DashboardGrouping = "WEEKLY";

export type DashboardOverviewFilter = {
  from: string;
  to: string;
  grouping: DashboardGrouping;
  recentLimit: number;
  countryLimit: number;
};

export type DashboardMetric = {
  value: number;
  previousValue: number;
  percentageChange: number;
  comparisonAvailable: boolean;
};

export type DashboardSummary = {
  totalRevenue: DashboardMetric;
  totalBooks: DashboardMetric;
  totalOrders: DashboardMetric;
  totalPickupStations: DashboardMetric;
  orderPlaced: DashboardMetric;
  packaging: DashboardMetric;
  shipped: DashboardMetric;
  inTransit: DashboardMetric;
  readyForPickup: DashboardMetric;
  readyForDelivery: DashboardMetric;
  delivered: DashboardMetric;
  pendingOrders: DashboardMetric;
  untrackedPaidOrders: number;
};

export type DashboardRevenuePoint = {
  periodStart: string;
  revenue: number;
};

export type DashboardFulfilment = {
  deliveryOrders: number;
  pickupOrders: number;
  unknownOrders: number;
  deliveryPercentage: number;
  pickupPercentage: number;
  unknownPercentage: number;
};

export type DashboardCountry = {
  country: string;
  orders: number;
  percentage: number;
};

export type DashboardRecentBook = {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  historicalPrice: boolean;
};

export type DashboardRecentOrder = {
  orderId: string;
  userId: string;
  customerName: string;
  logisticsType: string;
  amount: number;
  currencyCode: string;
  paymentStatus: string;
  fulfilmentStatus: string;
  shippingCountry: string;
  createdAt: string;
  books: DashboardRecentBook[];
};

export type DashboardOverview = {
  from: string;
  to: string;
  previousFrom: string;
  previousTo: string;
  grouping: DashboardGrouping;
  currencyCode: string;
  summary: DashboardSummary;
  revenueTrend: DashboardRevenuePoint[];
  fulfilment: DashboardFulfilment;
  topCountries: DashboardCountry[];
  totalShippingOrders: number;
  otherShippingOrders: number;
  recentOrders: DashboardRecentOrder[];
  notes: string[];
};

export interface PrivateDashboardApi {
  overview(filter: DashboardOverviewFilter, accessToken: string): Promise<ApiResponse<DashboardOverview>>;
}

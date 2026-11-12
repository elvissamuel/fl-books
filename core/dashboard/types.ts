export type RevenuePeriod = "weekly" | "monthly";

export type DashboardStat = {
  id: string;
  label: string;
  value: number;
  currency: "USD" | "NGN" | null;
  trendPercent: number | null;
};

export type RevenuePoint = {
  label: string;
  revenue: number;
  highlighted?: boolean;
  tooltipLabel?: string;
};

export type RevenueTrend = {
  period: RevenuePeriod;
  points: RevenuePoint[];
};

export type FulfillmentSlice = {
  id: "delivery" | "pickup" | "unknown";
  label: string;
  percent: number;
};

export type ShippingCountry = {
  code: "US" | "NG" | "CA" | "GH" | null;
  name: string;
  orders: number;
  shareLabel: string;
};

export type ShippingSummary = {
  countries: ShippingCountry[];
  totalOrders: number;
  totalShareLabel: string;
};

export type OrderStatus = "shipped" | "pending" | string;

export type RecentOrder = {
  id: string;
  customer: string;
  type: string;
  amount: number;
  currencyCode: string;
  bookType: string;
  price: number;
  quantity: number;
  status: string;
};

export interface DashboardApi {
  getStats(): Promise<DashboardStat[]>;
  getRevenueTrend(period: RevenuePeriod): Promise<RevenueTrend>;
  getFulfillment(): Promise<FulfillmentSlice[]>;
  getShippingCountries(): Promise<ShippingSummary>;
  getRecentOrders(): Promise<RecentOrder[]>;
}

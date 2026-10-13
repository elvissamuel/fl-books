export type RevenuePeriod = "weekly" | "monthly";

export type DashboardStat = {
  id: string;
  label: string;
  value: number;
  currency: "USD" | null;
  trendPercent: number;
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
  id: "delivery" | "pickup";
  label: string;
  percent: number;
};

export type ShippingCountry = {
  code: "US" | "NG" | "CA" | "GH";
  name: string;
  orders: number;
  shareLabel: string;
};

export type ShippingSummary = {
  countries: ShippingCountry[];
  totalOrders: number;
  totalShareLabel: string;
};

export type OrderStatus = "shipped" | "pending";

export type RecentOrder = {
  id: string;
  customer: string;
  type: "Delivery";
  amount: number;
  bookType: string;
  price: number;
  quantity: number;
  status: OrderStatus;
};

export interface DashboardApi {
  getStats(): Promise<DashboardStat[]>;
  getRevenueTrend(period: RevenuePeriod): Promise<RevenueTrend>;
  getFulfillment(): Promise<FulfillmentSlice[]>;
  getShippingCountries(): Promise<ShippingSummary>;
  getRecentOrders(): Promise<RecentOrder[]>;
}

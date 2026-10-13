import type {
  DashboardApi,
  DashboardStat,
  FulfillmentSlice,
  RecentOrder,
  RevenueTrend,
  ShippingSummary,
} from "@/core/dashboard/types";

const stats: DashboardStat[] = [
  { id: "revenue", label: "Total Revenue", value: 50000, currency: "USD", trendPercent: 30 },
  { id: "books", label: "Total Books", value: 400, currency: null, trendPercent: 30 },
  { id: "orders", label: "Total Orders", value: 200, currency: null, trendPercent: 30 },
  {
    id: "stations",
    label: "Total Pick Up Stations",
    value: 14,
    currency: null,
    trendPercent: 30,
  },
  { id: "shipped", label: "Shipped", value: 30, currency: null, trendPercent: 30 },
  { id: "processing", label: "Processing", value: 20, currency: null, trendPercent: 30 },
  { id: "delivered", label: "Delivered", value: 10, currency: null, trendPercent: 30 },
  {
    id: "pending",
    label: "Pending Orders",
    value: 140,
    currency: null,
    trendPercent: 30,
  },
];

const monthlyRevenue: RevenueTrend = {
  period: "monthly",
  points: [
    { label: "Jan", revenue: 46000 },
    { label: "Feb", revenue: 52000 },
    { label: "Mar", revenue: 34000 },
    { label: "Apr", revenue: 65500, highlighted: true, tooltipLabel: "April" },
    { label: "May", revenue: 54000 },
    { label: "Jun", revenue: 41000 },
    { label: "Jul", revenue: 50000 },
    { label: "Aug", revenue: 57500 },
    { label: "Sep", revenue: 53000 },
    { label: "Oct", revenue: 30000 },
    { label: "Nov", revenue: 47000 },
    { label: "Dec", revenue: 39000 },
  ],
};

const weeklyRevenue: RevenueTrend = {
  period: "weekly",
  points: [
    { label: "Mon", revenue: 28000 },
    { label: "Tue", revenue: 36000 },
    { label: "Wed", revenue: 33000 },
    { label: "Thu", revenue: 62000, highlighted: true, tooltipLabel: "Thursday" },
    { label: "Fri", revenue: 48000 },
    { label: "Sat", revenue: 41000 },
    { label: "Sun", revenue: 35000 },
  ],
};

const fulfillment: FulfillmentSlice[] = [
  { id: "delivery", label: "Delivery", percent: 68 },
  { id: "pickup", label: "Pickup (In-Store)", percent: 32 },
];

const shipping: ShippingSummary = {
  countries: [
    { code: "US", name: "United States", orders: 128, shareLabel: "25%" },
    { code: "NG", name: "Nigeria", orders: 130, shareLabel: "25%" },
    { code: "CA", name: "Canada", orders: 70, shareLabel: "40%" },
    { code: "GH", name: "Ghana", orders: 235, shareLabel: "10%" },
  ],
  totalOrders: 563,
  totalShareLabel: "100%",
};

const recentOrders: RecentOrder[] = [
  {
    id: "ORD-0092",
    customer: "Adebayo Johnson",
    type: "Delivery",
    amount: 15000,
    bookType: "Be different",
    price: 6200,
    quantity: 4,
    status: "shipped",
  },
  {
    id: "ORD-0082",
    customer: "Adebayo Johnson",
    type: "Delivery",
    amount: 15000,
    bookType: "Be different",
    price: 6200,
    quantity: 4,
    status: "shipped",
  },
  {
    id: "ORD-0092",
    customer: "Adebayo Johnson",
    type: "Delivery",
    amount: 15000,
    bookType: "Be different",
    price: 6200,
    quantity: 4,
    status: "pending",
  },
];

export const dashboardFixtures = {
  stats,
  revenue: {
    weekly: weeklyRevenue,
    monthly: monthlyRevenue,
  },
  fulfillment,
  shipping,
  recentOrders,
};

export const dashboardEndpoints = {
  stats: "/api/admin/dashboard/stats",
  revenue: (period: RevenueTrend["period"]) =>
    `/api/admin/dashboard/revenue?period=${period}`,
  fulfillment: "/api/admin/dashboard/fulfillment",
  shipping: "/api/admin/dashboard/shipping-countries",
  recentOrders: "/api/admin/dashboard/recent-orders",
} as const;

export const dashboardApi: DashboardApi = {
  async getStats() {
    return dashboardFixtures.stats;
  },
  async getRevenueTrend(period) {
    return dashboardFixtures.revenue[period];
  },
  async getFulfillment() {
    return dashboardFixtures.fulfillment;
  },
  async getShippingCountries() {
    return dashboardFixtures.shipping;
  },
  async getRecentOrders() {
    return dashboardFixtures.recentOrders;
  },
};

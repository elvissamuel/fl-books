import type { DashboardMetric, DashboardOverview, DashboardRecentOrder } from "@/core/dashboard/private-api";
import type {
  DashboardStat,
  FulfillmentSlice,
  RecentOrder,
  RevenueTrend,
  ShippingCountry,
  ShippingSummary,
} from "@/core/dashboard/types";

const countryCodes: Record<string, ShippingCountry["code"]> = {
  us: "US",
  usa: "US",
  "united states": "US",
  "united states of america": "US",
  ng: "NG",
  nigeria: "NG",
  ca: "CA",
  canada: "CA",
  gh: "GH",
  ghana: "GH",
};

function metricStat(
  id: string,
  label: string,
  metric: DashboardMetric,
  currency: DashboardStat["currency"],
): DashboardStat {
  return {
    id,
    label,
    value: metric.value,
    currency,
    trendPercent: metric.comparisonAvailable ? metric.percentageChange : null,
  };
}

function periodLabel(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function logisticsLabel(value: string) {
  if (value === "DELIVERY") return "Delivery";
  if (value === "PICKUP" || value === "PICK_UP") return "Pickup";
  if (!value) return "—";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function recentOrder(order: DashboardRecentOrder): RecentOrder {
  const books = order.books ?? [];
  const first = books[0];
  const quantity = books.reduce((sum, book) => sum + (book.quantity || 0), 0);
  return {
    id: order.orderId,
    customer: order.customerName || "—",
    type: logisticsLabel(order.logisticsType),
    amount: order.amount,
    currencyCode: order.currencyCode,
    bookType: first?.title || "—",
    price: first?.unitPrice ?? 0,
    quantity,
    status: order.fulfilmentStatus || "—",
  };
}

export function dashboardStats(overview: DashboardOverview): DashboardStat[] {
  const currency = overview.currencyCode === "USD" ? "USD" : overview.currencyCode === "NGN" ? "NGN" : null;
  const summary = overview.summary;
  return [
    metricStat("revenue", "Total Revenue", summary.totalRevenue, currency),
    metricStat("books", "Total Books", summary.totalBooks, null),
    metricStat("orders", "Total Orders", summary.totalOrders, null),
    metricStat("stations", "Total Pick Up Stations", summary.totalPickupStations, null),
    metricStat("shipped", "Shipped", summary.shipped, null),
    metricStat("processing", "Processing", summary.packaging, null),
    metricStat("delivered", "Delivered", summary.delivered, null),
    metricStat("pending", "Pending Orders", summary.pendingOrders, null),
  ];
}

export function dashboardRevenue(overview: DashboardOverview): RevenueTrend {
  const points = overview.revenueTrend.map((point) => ({
    label: periodLabel(point.periodStart),
    revenue: point.revenue,
  }));
  if (points.length === 0) {
    return { period: "weekly", points: [] };
  }
  const peak = points.reduce((best, point) => (point.revenue > best.revenue ? point : best));
  return {
    period: "weekly",
    points: points.map((point) =>
      point === peak ? { ...point, highlighted: true, tooltipLabel: point.label } : point,
    ),
  };
}

export function dashboardFulfilment(overview: DashboardOverview): FulfillmentSlice[] {
  const fulfilment = overview.fulfilment;
  const slices: FulfillmentSlice[] = [
    { id: "delivery", label: "Delivery", percent: fulfilment.deliveryPercentage },
    { id: "pickup", label: "Pickup (In-Store)", percent: fulfilment.pickupPercentage },
  ];
  if (fulfilment.unknownOrders > 0) {
    slices.push({ id: "unknown", label: "Unknown", percent: fulfilment.unknownPercentage });
  }
  return slices;
}

export function dashboardCountries(overview: DashboardOverview): ShippingSummary {
  return {
    countries: overview.topCountries.map((country) => ({
      code: countryCodes[country.country.trim().toLowerCase()] ?? null,
      name: country.country,
      orders: country.orders,
      shareLabel: `${country.percentage}%`,
    })),
    totalOrders: overview.totalShippingOrders,
    totalShareLabel: "100%",
  };
}

export function dashboardRecentOrders(overview: DashboardOverview) {
  return overview.recentOrders.map(recentOrder);
}

"use client";

import type {
  CalculateOrderRequest,
  CheckoutOrderRequest,
  CheckoutOrderResult,
  OrderCalculation,
  CancelOrderRequest,
  FulfilmentStatusResult,
  OrderCancellation,
  OrderFilterRequest,
  PaginatedOrders,
  PrivateOrder,
  UpdateFulfilmentStatusRequest,
} from "@/core/orders/private-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const checkout = "/api/v1/orders/private/checkout";
const customerFilter = "/api/v1/orders/private/customer/filter";
const filter = "/api/v1/orders/private/filter";
const calculate = "/api/v1/orders/private/calculate";
const list = "/api/v1/orders/private";
const byId = (orderId: string) => `/api/v1/orders/private/${encodeURIComponent(orderId)}`;
const fulfilmentStatus = (orderId: string) =>
  `/api/v1/orders/private/${encodeURIComponent(orderId)}/fulfilment-status`;
const customerList = "/api/v1/orders/private/customer";
const cancellation = (orderId: string) =>
  `/api/v1/orders/private/customer/${encodeURIComponent(orderId)}/cancellation`;
const customerById = (orderId: string) =>
  `/api/v1/orders/private/customer/${encodeURIComponent(orderId)}`;

function listSearch(query: OrderFilterRequest) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  setQuery(search, "orderId", query.orderId?.trim());
  setQuery(search, "userId", query.userId?.trim());
  setQuery(search, "pickUpLocationId", query.pickUpLocationId?.trim());
  setQuery(search, "paymentStatus", query.paymentStatus);
  setQuery(search, "logisticsType", query.logisticsType);
  setQuery(search, "fulfilmentStatus", query.fulfilmentStatus);
  setQuery(search, "paymentProvider", query.paymentProvider?.trim());
  setQuery(search, "paymentReference", query.paymentReference?.trim());
  setQuery(search, "createdFrom", query.createdFrom?.trim());
  setQuery(search, "createdTo", query.createdTo?.trim());
  setQuery(search, "minAmount", query.minAmount);
  setQuery(search, "maxAmount", query.maxAmount);
  setQuery(search, "sortBy", query.sortBy?.trim());
  setQuery(search, "sortDirection", query.sortDirection?.trim());
  return search;
}

export async function checkoutPrivateOrder(request: CheckoutOrderRequest) {
  return browserApi<CheckoutOrderResult>(checkout, { method: "POST", json: request });
}

export async function filterCustomerOrders(request: OrderFilterRequest) {
  return browserApi<PaginatedOrders>(customerFilter, { method: "POST", json: request });
}

export async function filterPrivateOrders(request: OrderFilterRequest) {
  return browserApi<PaginatedOrders>(filter, { method: "POST", json: request });
}

export async function calculatePrivateOrder(request: CalculateOrderRequest) {
  return browserApi<OrderCalculation>(calculate, { method: "POST", json: request });
}

export async function listPrivateOrders(query: OrderFilterRequest) {
  return browserApi<PaginatedOrders>(withSearch(list, listSearch(query)));
}

export async function getPrivateOrder(orderId: string) {
  return browserApi<PrivateOrder>(byId(orderId));
}

export async function updateOrderFulfilmentStatus(
  orderId: string,
  request: UpdateFulfilmentStatusRequest,
) {
  return browserApi<FulfilmentStatusResult>(fulfilmentStatus(orderId), {
    method: "PATCH",
    json: request,
  });
}

export async function cancelPrivateOrder(orderId: string, request: CancelOrderRequest) {
  return browserApi<OrderCancellation>(cancellation(orderId), { method: "POST", json: request });
}

export async function listCustomerOrders(query: OrderFilterRequest) {
  return browserApi<PaginatedOrders>(withSearch(customerList, listSearch(query)));
}

export async function getCustomerOrder(orderId: string) {
  return browserApi<PrivateOrder>(customerById(orderId));
}

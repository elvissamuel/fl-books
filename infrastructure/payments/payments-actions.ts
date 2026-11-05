"use client";

import type {
  PaginatedPayments,
  Payment,
  PaymentFilterRequest,
  VerifyPaymentRequest,
  VerifyPaymentResult,
} from "@/core/payments/private-api";
import { browserApi, setQuery, withSearch } from "@/infrastructure/http/browser-api";

const customerFilter = "/api/v1/payments/private/customer/filter";
const filter = "/api/v1/payments/private/filter";
const verify = "/api/v1/payments/private/verify";
const list = "/api/v1/payments/private";
const byId = (paymentId: number | string) =>
  `/api/v1/payments/private/${encodeURIComponent(String(paymentId))}`;

function listSearch(query: PaymentFilterRequest) {
  const search = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
  });
  setQuery(search, "search", query.search?.trim());
  setQuery(search, "paymentId", query.paymentId);
  setQuery(search, "reference", query.reference?.trim());
  setQuery(search, "orderId", query.orderId?.trim());
  setQuery(search, "userId", query.userId?.trim());
  setQuery(search, "bookId", query.bookId?.trim());
  setQuery(search, "provider", query.provider);
  setQuery(search, "status", query.status);
  setQuery(search, "paymentType", query.paymentType);
  setQuery(search, "verifiedBy", query.verifiedBy);
  setQuery(search, "currencyCode", query.currencyCode?.trim());
  setQuery(search, "currencyRateId", query.currencyRateId?.trim());
  setQuery(search, "minAmount", query.minAmount);
  setQuery(search, "maxAmount", query.maxAmount);
  setQuery(search, "createdFrom", query.createdFrom?.trim());
  setQuery(search, "createdTo", query.createdTo?.trim());
  setQuery(search, "sortBy", query.sortBy?.trim());
  setQuery(search, "sortDirection", query.sortDirection?.trim());
  return search;
}

export async function filterCustomerPayments(request: PaymentFilterRequest) {
  return browserApi<PaginatedPayments>(customerFilter, { method: "POST", json: request });
}

export async function filterPrivatePayments(request: PaymentFilterRequest) {
  return browserApi<PaginatedPayments>(filter, { method: "POST", json: request });
}

export async function verifyPrivatePayment(request: VerifyPaymentRequest) {
  return browserApi<VerifyPaymentResult>(verify, { method: "PUT", json: request });
}

export async function listPrivatePayments(query: PaymentFilterRequest) {
  return browserApi<PaginatedPayments>(withSearch(list, listSearch(query)));
}

export async function getPrivatePayment(paymentId: number | string) {
  return browserApi<Payment>(byId(paymentId));
}

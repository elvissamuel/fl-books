import "server-only";

import type { PaymentFilterRequest, PrivatePaymentsApi } from "@/core/payments/private-api";
import { apiJson } from "@/infrastructure/http/api-client";

export const privatePaymentEndpoints = {
  customerFilter: "/api/v1/payments/private/customer/filter",
  filter: "/api/v1/payments/private/filter",
  verify: "/api/v1/payments/private/verify",
  list: "/api/v1/payments/private",
  byId: (paymentId: number | string) =>
    `/api/v1/payments/private/${encodeURIComponent(String(paymentId))}`,
} as const;

function withAccessToken(accessToken: string, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  };
}

function setQuery(
  search: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined || value === "") return;
  search.set(key, String(value));
}

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

export const privatePaymentsApi: PrivatePaymentsApi = {
  filterCustomer(request, accessToken) {
    return apiJson(
      privatePaymentEndpoints.customerFilter,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  filter(request, accessToken) {
    return apiJson(
      privatePaymentEndpoints.filter,
      withAccessToken(accessToken, {
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  },

  verify(request, accessToken) {
    return apiJson(
      privatePaymentEndpoints.verify,
      withAccessToken(accessToken, {
        method: "PUT",
        body: JSON.stringify(request),
      }),
    );
  },

  list(query, accessToken) {
    const path = `${privatePaymentEndpoints.list}?${listSearch(query).toString()}`;
    return apiJson(path, withAccessToken(accessToken));
  },

  get(paymentId, accessToken) {
    return apiJson(privatePaymentEndpoints.byId(paymentId), withAccessToken(accessToken));
  },
};

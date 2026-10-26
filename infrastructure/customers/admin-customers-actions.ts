"use server";

import type { ApiResponse } from "@/core/auth/admin-api";
import type { AdminCustomerFilterQuery, AdminCustomerListQuery } from "@/core/customers/admin-api";
import { adminActionFailure, readActionSession } from "@/infrastructure/auth/admin-action";
import { adminCustomersApi } from "@/infrastructure/customers/http-admin-customers-api";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; sessionExpired?: boolean };

async function run<T>(
  task: (accessToken: string) => Promise<ApiResponse<T>>,
): Promise<ActionResult<T>> {
  const opened = await readActionSession();
  if (!opened.session) return opened.failure;

  try {
    return unwrap(await task(opened.session.accessToken));
  } catch (error) {
    return adminActionFailure(error);
  }
}

function unwrap<T>(response: ApiResponse<T>): ActionResult<T> {
  if (!response.success || response.data == null) {
    return { ok: false, message: response.message || "Request failed." };
  }
  return { ok: true, data: response.data };
}

export async function listAdminCustomers(query: AdminCustomerListQuery) {
  return run((accessToken) => adminCustomersApi.list(query, accessToken));
}

export async function filterAdminCustomers(query: AdminCustomerFilterQuery) {
  return run((accessToken) => adminCustomersApi.filter(query, accessToken));
}

export async function getAdminCustomer(customerId: string) {
  return run((accessToken) => adminCustomersApi.get(customerId, accessToken));
}

export async function deleteAdminCustomer(customerId: string) {
  return run((accessToken) => adminCustomersApi.delete(customerId, accessToken));
}

export async function deactivateAdminCustomer(customerId: string) {
  return run((accessToken) => adminCustomersApi.deactivate(customerId, accessToken));
}

export async function activateAdminCustomer(customerId: string) {
  return run((accessToken) => adminCustomersApi.activate(customerId, accessToken));
}

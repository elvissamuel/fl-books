import type { ApiResponse } from "@/core/auth/admin-api";
import type { Currency, CurrencyWriteRequest } from "@/core/currencies/currency";

export interface PrivateCurrenciesApi {
  list(accessToken: string): Promise<ApiResponse<Currency[]>>;
  get(currencyId: string, accessToken: string): Promise<ApiResponse<Currency>>;
  create(request: CurrencyWriteRequest, accessToken: string): Promise<ApiResponse<Currency>>;
  update(
    currencyId: string,
    request: CurrencyWriteRequest,
    accessToken: string,
  ): Promise<ApiResponse<Currency>>;
  delete(currencyId: string, accessToken: string): Promise<ApiResponse<string>>;
  activate(currencyId: string, accessToken: string): Promise<ApiResponse<Currency>>;
  deactivate(currencyId: string, accessToken: string): Promise<ApiResponse<Currency>>;
}

import type { ApiResponse } from "@/core/auth/admin-api";
import type {
  Currency,
  CurrencyConversion,
  CurrencyConversionRequest,
} from "@/core/currencies/currency";

export interface PublicCurrenciesApi {
  list(): Promise<ApiResponse<Currency[]>>;
  getByCode(currencyCode: string): Promise<ApiResponse<Currency>>;
  convert(request: CurrencyConversionRequest): Promise<ApiResponse<CurrencyConversion>>;
}

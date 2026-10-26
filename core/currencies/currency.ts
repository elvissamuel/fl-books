export type Currency = {
  id: string;
  currencyCode: string;
  currencyName: string;
  exchangeRate: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CurrencyWriteRequest = {
  currencyCode: string;
  currencyName: string;
  exchangeRate: number;
  active: boolean;
};

export type CurrencyConversionRequest = {
  currencyCode: string;
  nairaAmount: number;
};

export type CurrencyConversion = {
  currencyCode: string;
  currencyName: string;
  nairaAmount: number;
  exchangeRate: number;
  convertedAmount: number;
};

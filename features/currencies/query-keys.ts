export const currencyKeys = {
  all: ["currencies"] as const,
  privateList: () => [...currencyKeys.all, "private", "list"] as const,
  privateDetail: (currencyId: string) =>
    [...currencyKeys.all, "private", "detail", currencyId] as const,
  publicList: () => [...currencyKeys.all, "public", "list"] as const,
  publicByCode: (currencyCode: string) =>
    [...currencyKeys.all, "public", "code", currencyCode] as const,
};

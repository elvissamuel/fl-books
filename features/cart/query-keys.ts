export const cartKeys = {
  all: ["cart"] as const,
  private: () => [...cartKeys.all, "private"] as const,
};

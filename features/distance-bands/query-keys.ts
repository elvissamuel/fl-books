export const distanceBandKeys = {
  all: ["distance-bands"] as const,
  list: () => [...distanceBandKeys.all, "list"] as const,
  detail: (bandId: string) => [...distanceBandKeys.all, "detail", bandId] as const,
};

export function formatWeight(kg: number) {
  const rounded = Math.round(kg * 10) / 10;
  return `${rounded}kg`;
}

export function formatWeightFromGrams(grams: number) {
  return formatWeight(grams / 1000);
}

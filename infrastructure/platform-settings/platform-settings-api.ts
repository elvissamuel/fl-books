import type {
  AdminProfile,
  DistanceTier,
  DistanceTierInput,
  PlatformSettings,
  PlatformSettingsApi,
  StoreCurrency,
  StoreCurrencyInput,
  WeightSurcharge,
} from "@/core/platform-settings/types";

const initialTiers: DistanceTier[] = [
  {
    id: "tier-1",
    label: "Local Hub Vicinity (0 – 5 km)",
    minKm: 0,
    maxKm: 5,
    fee: 5300,
    transit: "Same Day (2–4 hours)",
  },
  {
    id: "tier-2",
    label: "City Core Metro (5 – 15 km)",
    minKm: 5,
    maxKm: 15,
    fee: 10010,
    transit: "Next Day Morning",
  },
  {
    id: "tier-3",
    label: "Greater Suburban Ring (15 – 30 km)",
    minKm: 15,
    maxKm: 30,
    fee: 16940,
    transit: "1 – 2 Business Days",
  },
  {
    id: "tier-4",
    label: "Regional Extended Zone (30 – 50 km)",
    minKm: 30,
    maxKm: 50,
    fee: 28490,
    transit: "2 – 3 Business Days",
  },
  {
    id: "tier-5",
    label: "Outer Perimeter (> 50 km)",
    minKm: 50,
    maxKm: 0,
    fee: 43120,
    transit: "3 – 5 Business Days",
  },
];

let profile: AdminProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  imageUrl: "/admin-profile.png",
  inAppNotifications: true,
  emailNotifications: true,
};

let tiers = initialTiers.map((tier) => ({ ...tier }));
let weight: WeightSurcharge = { baseKg: 1, ratePerKg: 1200 };
let currencies: StoreCurrency[] = Array.from({ length: 5 }, (_, index) => ({
  id: `currency-${index + 1}`,
  name: "US Dollars",
  code: "USD",
  baseCurrency: "NGN",
  rate: 1540,
}));
let nextId = 6;

function snapshot(): PlatformSettings {
  return {
    profile: { ...profile },
    tiers: tiers.map((tier) => ({ ...tier })),
    weight: { ...weight },
    currencies: currencies.map((currency) => ({ ...currency })),
  };
}

export const currencyChoices = [
  { code: "USD", name: "US Dollars" },
  { code: "GBP", name: "British Pounds" },
  { code: "EUR", name: "Euros" },
  { code: "GHS", name: "Ghana Cedis" },
  { code: "CAD", name: "Canadian Dollars" },
] as const;

export const platformSettingsApi: PlatformSettingsApi = {
  async get() {
    return snapshot();
  },
  async updateProfile(next) {
    profile = { ...next };
    return { ...profile };
  },
  async updateWeight(next) {
    weight = { ...next };
    return { ...weight };
  },
  async saveTier(input) {
    if (input.id) {
      tiers = tiers.map((tier) => (tier.id === input.id ? { ...tier, ...input, id: tier.id } : tier));
      const saved = tiers.find((tier) => tier.id === input.id);
      if (!saved) throw new Error("Distance tier was not found.");
      return { ...saved };
    }
    const created: DistanceTier = {
      id: `tier-${nextId++}`,
      label: input.label,
      minKm: input.minKm,
      maxKm: input.maxKm,
      fee: input.fee,
      transit: input.transit,
    };
    tiers = [...tiers, created];
    return { ...created };
  },
  async deleteTier(tierId) {
    tiers = tiers.filter((tier) => tier.id !== tierId);
  },
  async saveCurrency(input) {
    if (input.id) {
      currencies = currencies.map((currency) =>
        currency.id === input.id ? { ...currency, ...input, id: currency.id } : currency,
      );
      const saved = currencies.find((currency) => currency.id === input.id);
      if (!saved) throw new Error("Currency was not found.");
      return { ...saved };
    }
    const created: StoreCurrency = {
      id: `currency-${nextId++}`,
      name: input.name,
      code: input.code,
      baseCurrency: input.baseCurrency,
      rate: input.rate,
    };
    currencies = [...currencies, created];
    return { ...created };
  },
  async deleteCurrency(currencyId) {
    currencies = currencies.filter((currency) => currency.id !== currencyId);
  },
};

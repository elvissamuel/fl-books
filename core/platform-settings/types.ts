export type AdminProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string;
  inAppNotifications: boolean;
  emailNotifications: boolean;
};

export type DistanceTier = {
  id: string;
  label: string;
  minKm: number;
  maxKm: number;
  fee: number;
  transit: string;
};

export type DistanceTierInput = {
  id?: string;
  label: string;
  minKm: number;
  maxKm: number;
  fee: number;
  transit: string;
};

export type WeightSurcharge = {
  baseKg: number;
  ratePerKg: number;
};

export type StoreCurrency = {
  id: string;
  name: string;
  code: string;
  baseCurrency: string;
  rate: number;
};

export type StoreCurrencyInput = {
  id?: string;
  name: string;
  code: string;
  baseCurrency: string;
  rate: number;
};

export type PlatformSettings = {
  profile: AdminProfile;
  tiers: DistanceTier[];
  weight: WeightSurcharge;
  currencies: StoreCurrency[];
};

export interface PlatformSettingsApi {
  get(): Promise<PlatformSettings>;
  updateProfile(profile: AdminProfile): Promise<AdminProfile>;
  updateWeight(weight: WeightSurcharge): Promise<WeightSurcharge>;
  saveTier(input: DistanceTierInput): Promise<DistanceTier>;
  deleteTier(tierId: string): Promise<void>;
  saveCurrency(input: StoreCurrencyInput): Promise<StoreCurrency>;
  deleteCurrency(currencyId: string): Promise<void>;
}

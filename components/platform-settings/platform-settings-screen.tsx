"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { AdminProfilePanel } from "@/components/platform-settings/admin-profile-panel";
import { CurrencyDialog } from "@/components/platform-settings/currency-dialog";
import { DistancePricingPanel } from "@/components/platform-settings/distance-pricing-panel";
import { DistanceTierDialog } from "@/components/platform-settings/distance-tier-dialog";
import { SettingsDeleteDialog } from "@/components/platform-settings/settings-delete-dialog";
import { SettingsSuccessDialog } from "@/components/platform-settings/settings-success-dialog";
import { StoreCurrencyPanel } from "@/components/platform-settings/store-currency-panel";
import { Button } from "@/components/ui/button";
import type { Currency, CurrencyWriteRequest } from "@/core/currencies/currency";
import type { DistanceBand, DistanceBandWriteRequest } from "@/core/distance-bands/private-api";
import type { AdminProfile, PlatformSettings, WeightSurcharge } from "@/core/platform-settings/types";
import {
  useCreatePrivateCurrency,
  useDeletePrivateCurrency,
  usePrivateCurrencies,
  usePrivateCurrency,
  useUpdatePrivateCurrency,
} from "@/features/currencies/use-private-currencies";
import {
  useCreatePrivateDistanceBand,
  useDeletePrivateDistanceBand,
  usePrivateDistanceBand,
  usePrivateDistanceBands,
  useUpdatePrivateDistanceBand,
} from "@/features/distance-bands/use-distance-bands";
import { platformSettingsKeys } from "@/features/platform-settings/query-keys";
import { usePlatformSettings } from "@/features/platform-settings/use-platform-settings";
import { platformSettingsApi } from "@/infrastructure/platform-settings/platform-settings-api";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "distance" | "currency";

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Admin Profile" },
  { id: "distance", label: "Distance and Weight Pricing" },
  { id: "currency", label: "Store Currency" },
];

type DeleteTarget = { kind: "tier"; item: DistanceBand } | { kind: "currency"; item: Currency };

export function PlatformSettingsScreen() {
  const queryClient = useQueryClient();
  const settings = usePlatformSettings();
  const bands = usePrivateDistanceBands();
  const createBand = useCreatePrivateDistanceBand();
  const updateBand = useUpdatePrivateDistanceBand();
  const deleteBand = useDeletePrivateDistanceBand();
  const currenciesQuery = usePrivateCurrencies();
  const createCurrency = useCreatePrivateCurrency();
  const updateCurrency = useUpdatePrivateCurrency();
  const deleteCurrency = useDeletePrivateCurrency();
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [weight, setWeight] = useState<WeightSurcharge | null>(null);
  const [editBandId, setEditBandId] = useState("");
  const [tierDialog, setTierDialog] = useState<DistanceBand | "create" | null>(null);
  const [editCurrencyId, setEditCurrencyId] = useState("");
  const [currencyDialog, setCurrencyDialog] = useState<Currency | "create" | null>(null);
  const [success, setSuccess] = useState<"tier" | "currency" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DeleteTarget | null>(null);
  const [actionError, setActionError] = useState("");
  const editBand = usePrivateDistanceBand(editBandId);
  const editCurrency = usePrivateCurrency(editCurrencyId);
  const savingBand = createBand.isPending || updateBand.isPending;
  const savingCurrency = createCurrency.isPending || updateCurrency.isPending;
  const editingBand = tierDialog !== null && tierDialog !== "create";
  const editingCurrency = currencyDialog !== null && currencyDialog !== "create";

  useEffect(() => {
    if (!editBandId || editingBand) return;

    if (editBand.data?.id === editBandId) {
      setTierDialog(editBand.data);
      return;
    }

    if (editBand.error instanceof Error) {
      setActionError(editBand.error.message);
      setEditBandId("");
    }
  }, [editBand.data, editBand.error, editBandId, editingBand]);

  useEffect(() => {
    if (!editCurrencyId || editingCurrency) return;

    if (editCurrency.data?.id === editCurrencyId) {
      setCurrencyDialog(editCurrency.data);
      return;
    }

    if (editCurrency.error instanceof Error) {
      setActionError(editCurrency.error.message);
      setEditCurrencyId("");
    }
  }, [editCurrency.data, editCurrency.error, editCurrencyId, editingCurrency]);

  useEffect(() => {
    if (!settings.data) return;
    setProfile((current) => current ?? settings.data.profile);
    setWeight((current) => current ?? settings.data.weight);
  }, [settings.data]);

  function remember(next: PlatformSettings) {
    queryClient.setQueryData(platformSettingsKeys.all, next);
  }

  function changeProfile(next: AdminProfile) {
    setProfile(next);
    const current = queryClient.getQueryData<PlatformSettings>(platformSettingsKeys.all);
    if (current) remember({ ...current, profile: next });
    void platformSettingsApi.updateProfile(next);
  }

  function changeWeight(next: WeightSurcharge) {
    setWeight(next);
    const current = queryClient.getQueryData<PlatformSettings>(platformSettingsKeys.all);
    if (current) remember({ ...current, weight: next });
    void platformSettingsApi.updateWeight(next);
  }

  function closeTierDialog() {
    if (savingBand) return;
    setTierDialog(null);
    setEditBandId("");
  }

  async function confirmTier(input: DistanceBandWriteRequest) {
    setActionError("");
    const created = tierDialog === "create";
    try {
      if (created) {
        await createBand.mutateAsync(input);
      } else if (editingBand) {
        await updateBand.mutateAsync({ bandId: tierDialog.id, request: input });
      }
      setTierDialog(null);
      setEditBandId("");
      if (created) setSuccess("tier");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Request failed.");
    }
  }

  function closeCurrencyDialog() {
    if (savingCurrency) return;
    setCurrencyDialog(null);
    setEditCurrencyId("");
  }

  async function confirmCurrency(input: CurrencyWriteRequest) {
    setActionError("");
    const created = currencyDialog === "create";
    try {
      if (created) {
        await createCurrency.mutateAsync(input);
      } else if (editingCurrency) {
        await updateCurrency.mutateAsync({ currencyId: currencyDialog.id, request: input });
      }
      setCurrencyDialog(null);
      setEditCurrencyId("");
      if (created) setSuccess("currency");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Request failed.");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setActionError("");
    try {
      if (pendingDelete.kind === "tier") await deleteBand.mutateAsync(pendingDelete.item.id);
      else await deleteCurrency.mutateAsync(pendingDelete.item.id);
      setPendingDelete(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Request failed.");
      setPendingDelete(null);
    }
  }

  const tiers = bands.data ?? [];
  const currencies = currenciesQuery.data ?? [];

  return (
    <div className="px-5 pt-5 pb-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-950">Platform Settings</h1>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full border-neutral-200 bg-white text-neutral-600 shadow-none"
          aria-label="Notifications"
        >
          <Bell className="size-4" strokeWidth={1.75} />
        </Button>
      </header>

      {settings.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{settings.error.message}</p>
      ) : null}
      {bands.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{bands.error.message}</p>
      ) : null}
      {currenciesQuery.error instanceof Error ? (
        <p className="mb-3 text-sm text-danger">{currenciesQuery.error.message}</p>
      ) : null}
      {actionError ? <p className="mb-3 text-sm text-danger">{actionError}</p> : null}
      {settings.isLoading ? <p className="mb-3 text-sm text-neutral-500">Loading settings…</p> : null}
      {editBandId && !editingBand ? (
        <div
          role="status"
          className="fixed inset-y-0 right-0 left-0 z-40 flex items-center justify-center md:left-[232px]"
        >
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading distance band</span>
        </div>
      ) : null}
      {editCurrencyId && !editingCurrency ? (
        <div
          role="status"
          className="fixed inset-y-0 right-0 left-0 z-40 flex items-center justify-center md:left-[232px]"
        >
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
          <span className="sr-only">Loading currency</span>
        </div>
      ) : null}

      <section className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4" role="tablist">
          {tabs.map((option) => {
            const selected = option.id === tab;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(option.id)}
                className={cn(
                  "h-8 rounded-lg border px-3 text-xs font-medium",
                  selected
                    ? "border-[#d7f0e2] bg-[#eef8f2] text-[#3caf6e]"
                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="pt-5">
          {tab === "profile" && profile ? (
            <AdminProfilePanel profile={profile} onChange={changeProfile} />
          ) : null}
          {tab === "distance" && weight ? (
            <DistancePricingPanel
              tiers={tiers}
              loading={bands.isLoading}
              weight={weight}
              onWeightChange={changeWeight}
              onAdd={() => {
                setActionError("");
                setEditBandId("");
                setTierDialog("create");
              }}
              onEdit={(item) => {
                setActionError("");
                setTierDialog(null);
                setEditBandId(item.id);
              }}
              onDelete={(item) => setPendingDelete({ kind: "tier", item })}
            />
          ) : null}
          {tab === "currency" ? (
            <StoreCurrencyPanel
              currencies={currencies}
              loading={currenciesQuery.isLoading}
              onAdd={() => {
                setActionError("");
                setEditCurrencyId("");
                setCurrencyDialog("create");
              }}
              onEdit={(item) => {
                setActionError("");
                setCurrencyDialog(null);
                setEditCurrencyId(item.id);
              }}
              onDelete={(item) => setPendingDelete({ kind: "currency", item })}
            />
          ) : null}
        </div>
      </section>

      {tierDialog ? (
        <DistanceTierDialog
          key={tierDialog === "create" ? "create" : tierDialog.id}
          tier={tierDialog === "create" ? undefined : tierDialog}
          pending={savingBand}
          onClose={closeTierDialog}
          onSave={(input) => void confirmTier(input)}
        />
      ) : null}
      {currencyDialog ? (
        <CurrencyDialog
          key={currencyDialog === "create" ? "create" : currencyDialog.id}
          currency={currencyDialog === "create" ? undefined : currencyDialog}
          pending={savingCurrency}
          onClose={closeCurrencyDialog}
          onSave={(input) => void confirmCurrency(input)}
        />
      ) : null}
      {pendingDelete ? (
        <SettingsDeleteDialog
          name={
            pendingDelete.kind === "tier"
              ? pendingDelete.item.label
              : pendingDelete.item.currencyName
          }
          description={
            pendingDelete.kind === "tier"
              ? "This distance tier will be removed from the list."
              : "This currency will be removed from the list."
          }
          pending={deleteBand.isPending || deleteCurrency.isPending}
          onClose={() => {
            if (!deleteBand.isPending && !deleteCurrency.isPending) setPendingDelete(null);
          }}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
      {success ? (
        <SettingsSuccessDialog
          title={success === "tier" ? "Distance Tier Added Successfully" : "Currency Added Successfully"}
          description={
            success === "tier"
              ? "The new distance tier has been created and added to the system successfully."
              : "Currency has been created and added to the system successfully."
          }
          onDone={() => setSuccess(null)}
        />
      ) : null}
    </div>
  );
}

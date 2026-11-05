"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronUp, Phone, Search, User } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import type { PublicCustomer } from "@/core/customers/public-api";
import type { PickupLocation } from "@/core/pickup-stations/private-api";
import type { Currency } from "@/core/currencies/currency";
import { listPublicCurrencies } from "@/infrastructure/currencies/public-currencies-actions";
import { browserApi } from "@/infrastructure/http/browser-api";
import { checkoutPrivateOrder } from "@/infrastructure/orders/private-orders-actions";
import { listPrivatePickupLocations } from "@/infrastructure/pickup-stations/pickup-locations-actions";
import { paymentVerifyKey } from "@/components/checkout/payment-return";

const deliveryWindow = "Delivery between 21 August and 26 August";

type ShippingMethod = "delivery" | "pickup";
type PaymentMethod = "paystack" | "flutterwave";

function naira(value: number) {
  const digits = Math.round(value).toString();
  return `₦${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border bg-white ${
        checked ? "border-[#f47832]" : "border-[#cfd3da]"
      }`}
    >
      {checked ? <span className="size-[9px] rounded-full bg-[#f47832]" /> : null}
    </span>
  );
}

function PaystackMark() {
  return (
    <svg viewBox="0 0 28 18" className="h-[18px] w-7" aria-hidden>
      <rect x="2" y="1" width="24" height="3.4" rx="0.7" fill="#00c3f7" />
      <rect x="8" y="7.3" width="18" height="3.4" rx="0.7" fill="#00c3f7" />
      <rect x="14" y="13.6" width="12" height="3.4" rx="0.7" fill="#00c3f7" />
    </svg>
  );
}

function FlutterwaveMark() {
  return (
    <svg viewBox="0 0 28 18" className="h-[18px] w-7" aria-hidden>
      <path d="M4 13.5c3.2-7 6.4-7.4 9.2-2.2" fill="none" stroke="#f5a623" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M10 6.2c3.4 6.2 6.6 6.4 10.2-1.6" fill="none" stroke="#1fbf75" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M16 8.2c2.2 3.6 4.2 3.4 7.2-1.2" fill="none" stroke="#f26b3a" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

export function CheckoutScreen() {
  const router = useRouter();
  const { cart, ready } = useCart();
  const [method, setMethod] = useState<ShippingMethod>("delivery");
  const [areasOpen, setAreasOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [areas, setAreas] = useState<PickupLocation[]>([]);
  const [areasMessage, setAreasMessage] = useState("");
  const [areasLoading, setAreasLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState<PickupLocation | null>(null);
  const [sameAsMe, setSameAsMe] = useState(false);
  const [profile, setProfile] = useState<PublicCustomer | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("paystack");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currencyId, setCurrencyId] = useState("");
  const [currencyMessage, setCurrencyMessage] = useState("");
  const [paying, setPaying] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    listPublicCurrencies().then((result) => {
      if (cancelled) return;
      const data = result.ok ? result.data : null;
      const rows = Array.isArray(data)
        ? data
        : data && typeof data === "object" && Array.isArray((data as { data?: Currency[] }).data)
          ? (data as { data: Currency[] }).data
          : [];
      if (!result.ok || rows.length === 0) {
        setCurrencyMessage(
          !result.ok && result.sessionExpired
            ? "Sign in to load currencies."
            : result.ok
              ? "No currencies are available."
              : result.message,
        );
        return;
      }
      const active = rows.filter((currency) => currency.active);
      const choices = active.length > 0 ? active : rows;
      setCurrencies(choices);
      const naira = choices.find((currency) => currency.currencyCode === "NGN");
      setCurrencyId((naira ?? choices[0]).id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sameAsMe || profile) return;
    let cancelled = false;
    browserApi<PublicCustomer>("/api/v1/customer/private/profile").then((result) => {
      if (cancelled || !result.ok) return;
      setProfile(result.data);
      const fullName = [result.data.firstName, result.data.lastName].filter(Boolean).join(" ");
      if (fullName) setName(fullName);
      if (result.data.phoneNumber) setPhone(result.data.phoneNumber);
    });
    return () => {
      cancelled = true;
    };
  }, [sameAsMe, profile]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!areasOpen) return;
    let cancelled = false;
    setAreasLoading(true);
    setAreasMessage("");
    listPrivatePickupLocations({
      page: 1,
      size: 50,
      status: "ACTIVE",
      searchParams: debouncedQuery,
    }).then((result) => {
      if (cancelled) return;
      setAreasLoading(false);
      if (!result.ok) {
        setAreas([]);
        setAreasMessage(result.sessionExpired ? "Sign in to choose a pickup area." : result.message);
        return;
      }
      const rows = Array.isArray(result.data?.data) ? result.data.data : [];
      setAreas(rows);
      if (rows.length === 0) setAreasMessage("No areas match that search.");
    });
    return () => {
      cancelled = true;
    };
  }, [areasOpen, debouncedQuery]);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const weightSurcharge = 0;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + weightSurcharge + tax;

  function goBack() {
    router.push("/cart");
  }

  async function pay() {
    if (items.length === 0) {
      setCheckoutMessage("Add a book to your cart before payment.");
      return;
    }
    if (!selectedArea) {
      setCheckoutMessage("Choose your area before payment.");
      return;
    }
    if (!sameAsMe && (!name.trim() || !phone.trim())) {
      setCheckoutMessage("Add the recipient name and phone number.");
      return;
    }
    if (!currencyId) {
      setCheckoutMessage(currencyMessage || "Select a currency.");
      return;
    }

    setPaying(true);
    setCheckoutMessage("");

    let customer = profile;
    if (!customer) {
      const profileResult = await browserApi<PublicCustomer>("/api/v1/customer/private/profile");
      if (!profileResult.ok) {
        setPaying(false);
        setCheckoutMessage(
          profileResult.sessionExpired ? "Sign in to continue to payment." : profileResult.message,
        );
        return;
      }
      customer = profileResult.data;
      setProfile(customer);
    }

    const provider = payment === "paystack" ? "PAYSTACK" : "FLUTTERWAVE";
    const result = await checkoutPrivateOrder({
      userId: customer.userId,
      pickUpLocationId: selectedArea.id,
      paymentClientServiceType: provider,
      recipientName: sameAsMe ? "" : name.trim(),
      recipientPhone: sameAsMe ? "" : phone.trim(),
      logisticsType: method === "pickup" ? "PICKUP" : "DELIVERY",
      sameAsMe,
      currencyId,
    });
    if (!result.ok) {
      setPaying(false);
      setCheckoutMessage(result.sessionExpired ? "Sign in to continue to payment." : result.message);
      return;
    }

    const started = result.data.payment;
    if (!started?.authorizationUrl || !started.reference) {
      setPaying(false);
      setCheckoutMessage(started?.message || "Payment could not be started.");
      return;
    }

    sessionStorage.setItem(
      paymentVerifyKey,
      JSON.stringify({ reference: started.reference, provider }),
    );
    window.location.assign(started.authorizationUrl);
  }

  function toggleSameAsMe() {
    const next = !sameAsMe;
    setSameAsMe(next);
    if (!next || !profile) return;
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
    if (fullName) setName(fullName);
    if (profile.phoneNumber) setPhone(profile.phoneNumber);
  }

  if (!ready) {
    return <p className="px-6 py-16 text-sm text-[#8d939c] sm:px-10 lg:px-14">Loading checkout...</p>;
  }

  return (
    <div className="mx-auto grid w-full max-w-[1120px] items-start gap-5 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
      <div className="space-y-4">
        <section className="rounded-2xl border border-[#e7e9ee] bg-white px-4 py-4 sm:px-5">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-[18px] font-semibold text-[#1c1f24]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
            Shipping Details
          </button>

          <h2 className="mt-5 text-[14px] font-semibold text-[#1c1f24]">Shipping Method</h2>
          <div className="mt-3 space-y-3">
            {(
              [
                ["delivery", "Delivery"],
                ["pickup", "Pickup Station"],
              ] as const
            ).map(([value, label]) => {
              const checked = method === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  className="flex w-full items-start gap-3 rounded-xl border border-[#e6e8ee] px-4 py-3 text-left"
                >
                  <span className="mt-0.5">
                    <RadioMark checked={checked} />
                  </span>
                  <span>
                    <span className="block text-[14px] font-medium text-[#1c1f24]">{label}</span>
                    <span className="mt-0.5 block text-[12px] text-[#9aa1ab]">{deliveryWindow}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e7e9ee] bg-white px-4 py-4 sm:px-5">
          <h2 className="text-[15px] font-semibold text-[#1c1f24]">Choose Your Area</h2>
          <button
            type="button"
            onClick={() => setAreasOpen((open) => !open)}
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-[#e6e8ee] px-4 py-3 text-left text-[14px] text-[#1c1f24]"
          >
            {selectedArea ? (
              <span>
                <span className="font-medium">{selectedArea.locationName}</span>
                <span className="text-[#6d7480]"> ({selectedArea.fullAddress})</span>
              </span>
            ) : (
              <span className="text-[#9aa1ab]">Select an area</span>
            )}
            {areasOpen ? (
              <ChevronUp className="size-4 shrink-0 text-[#8d939c]" />
            ) : (
              <ChevronDown className="size-4 shrink-0 text-[#8d939c]" />
            )}
          </button>

          {areasOpen ? (
            <div className="mt-3 rounded-xl border border-[#e3e8f2] p-3">
              <label className="flex h-11 items-center gap-2 rounded-lg border border-[#e6e8ee] px-3 text-[#9aa1ab]">
                <Search className="size-4" strokeWidth={1.75} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="h-full w-full bg-transparent text-[14px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf]"
                />
              </label>
              <div className="mt-3 space-y-2">
                {areasLoading ? <p className="px-1 py-3 text-[13px] text-[#9aa1ab]">Loading areas...</p> : null}
                {areas.map((area) => {
                  const checked = area.id === selectedArea?.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => {
                        setSelectedArea(area);
                        setAreasOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#e6e8ee] px-4 py-3 text-left"
                    >
                      <span>
                        <span className="block text-[14px] font-semibold text-[#1c1f24]">{area.locationName}</span>
                        <span className="mt-0.5 block text-[12px] text-[#9aa1ab]">{area.fullAddress}</span>
                      </span>
                      <RadioMark checked={checked} />
                    </button>
                  );
                })}
                {!areasLoading && areasMessage ? (
                  <p className="px-1 py-3 text-[13px] text-[#9aa1ab]">{areasMessage}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#1c1f24]">Recipient Details</h2>
            <label className="inline-flex items-center gap-2 text-[13px] text-[#1c1f24]">
              <input
                type="checkbox"
                checked={sameAsMe}
                onChange={toggleSameAsMe}
                className="size-4 rounded border border-[#cfd3da] accent-[#f47832]"
              />
              Same As Me
            </label>
          </div>
          {sameAsMe ? null : (
          <div className="mt-3 space-y-3 rounded-2xl border border-[#e7e9ee] bg-white px-4 py-4">
            <label className="block">
              <span className="text-[13px] text-[#1c1f24]">Name</span>
              <span className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-[#e6e8ee] px-3 text-[#b0b6bf]">
                <User className="size-4" strokeWidth={1.75} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Type here"
                  className="h-full w-full bg-transparent text-[14px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf]"
                />
              </span>
            </label>
            <label className="block">
              <span className="text-[13px] text-[#1c1f24]">Phone Number</span>
              <span className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-[#e6e8ee] px-3 text-[#b0b6bf]">
                <Phone className="size-4" strokeWidth={1.75} />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+234"
                  inputMode="tel"
                  className="h-full w-full bg-transparent text-[14px] text-[#1c1f24] outline-none placeholder:text-[#b0b6bf]"
                />
              </span>
            </label>
          </div>
          )}
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-[#1c1f24]">Payment Details</h2>
          <div className="mt-3 rounded-2xl border border-[#e7e9ee] bg-white px-4 py-4">
            <label className="block">
              <span className="text-[14px] font-semibold text-[#1c1f24]">Currency</span>
              <select
                value={currencyId}
                onChange={(event) => setCurrencyId(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#e6e8ee] bg-white px-3 text-[14px] text-[#1c1f24] outline-none"
              >
                <option value="">Select a currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.currencyCode} - {currency.currencyName}
                  </option>
                ))}
              </select>
              {currencyMessage ? <span className="mt-2 block text-[12px] text-danger">{currencyMessage}</span> : null}
            </label>
            <h3 className="mt-4 text-[14px] font-semibold text-[#1c1f24]">Select Payment Method</h3>
            <div className="mt-3">
              {(
                [
                  ["paystack", "Pay with Paystack", <PaystackMark key="paystack" />],
                  ["flutterwave", "Flutterwave", <FlutterwaveMark key="flutterwave" />],
                ] as const
              ).map(([value, label, mark], index) => {
                const checked = payment === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPayment(value)}
                    className={`flex w-full items-center justify-between gap-3 py-3 text-left ${
                      index === 0 ? "border-b border-[#eef0f3]" : ""
                    }`}
                  >
                    <span className="inline-flex items-center gap-3 text-[14px] text-[#1c1f24]">
                      <RadioMark checked={checked} />
                      {label}
                    </span>
                    {mark}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <aside className="rounded-2xl border border-[#e7e9ee] bg-white p-5 lg:sticky lg:top-6">
        <h2 className="text-[16px] font-semibold text-[#1c1f24]">Books</h2>
        <ul className="mt-3 space-y-2.5 border-b border-[#eceef2] pb-4">
          {items.length === 0 ? (
            <li className="text-[13px] text-[#9aa1ab]">Your cart is empty.</li>
          ) : (
            items.map((item) => (
              <li key={item.cartItemId} className="flex items-start justify-between gap-3 text-[14px]">
                <span className="text-[#1c1f24]">
                  {item.title}
                  {item.quantity > 1 ? ` (${item.quantity}x)` : ""}
                </span>
                <span className="shrink-0 font-medium text-[#1c1f24]">{naira(item.lineTotal)}</span>
              </li>
            ))
          )}
        </ul>
        <h2 className="mt-4 text-[16px] font-semibold text-[#1c1f24]">Order Summary</h2>
        <dl className="mt-3 space-y-2.5 text-[14px]">
          <div className="flex items-center justify-between">
            <dt className="text-[#8d939c]">Subtotal</dt>
            <dd className="text-[#1c1f24]">{naira(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#8d939c]">Weight Surcharge (&gt;1kg)</dt>
            <dd className="text-[#1c1f24]">{naira(weightSurcharge)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#8d939c]">Tax (7.5%)</dt>
            <dd className="text-[#1c1f24]">{naira(tax)}</dd>
          </div>
          <div className="flex items-center justify-between pt-1">
            <dt className="font-semibold text-[#1c1f24]">Total</dt>
            <dd className="font-semibold text-[#1c1f24]">{naira(total)}</dd>
          </div>
        </dl>
        {checkoutMessage ? <p className="mt-3 text-[12px] text-danger">{checkoutMessage}</p> : null}
        <button
          type="button"
          disabled={paying || items.length === 0}
          onClick={pay}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#f47832] text-[14px] font-medium text-white hover:bg-[#e56d28] disabled:opacity-60"
        >
          {paying ? "Proceeding..." : "Proceed to Payment"}
        </button>
      </aside>
    </div>
  );
}

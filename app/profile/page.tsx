import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartProvider } from "@/components/cart/cart-provider";
import { StoreHeader } from "@/components/catalog/store-header";
import { catalogCanvas } from "@/components/landing/catalog-shared";
import { CustomerProfileForm } from "@/components/profile/customer-profile-form";
import type { CustomerProfile } from "@/core/customers/private-api";
import { getCustomerSession } from "@/infrastructure/auth/customer-session";
import { privateCustomersApi } from "@/infrastructure/customers/http-private-customers-api";
import { ApiError } from "@/infrastructure/http/api-client";
import { ptSerif } from "@/lib/public-font";

export const metadata: Metadata = {
  title: "Profile",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getCustomerSession();
  if (!session) redirect("/login?next=/profile");

  let profile: CustomerProfile | null = null;
  let message = "";

  try {
    const response = await privateCustomersApi.getProfile(session.accessToken);
    if (!response.success || !response.data) {
      message = response.message || "Could not load your profile.";
    } else {
      profile = response.data;
    }
  } catch (error) {
    message = error instanceof ApiError ? error.message : "Could not load your profile.";
  }

  return (
    <CartProvider>
      <main className={`${ptSerif.className} min-h-dvh`} style={{ backgroundColor: catalogCanvas }}>
        <StoreHeader active={null} />
        <section className="mx-auto w-full max-w-[720px] px-6 py-10">
          <h1 className="text-[28px] font-semibold text-[#1c1f24]">Profile</h1>
          {message ? <p className="mt-4 text-[14px] text-danger">{message}</p> : null}
          {profile ? <CustomerProfileForm profile={profile} /> : null}
        </section>
      </main>
    </CartProvider>
  );
}

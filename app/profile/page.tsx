import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartProvider } from "@/components/cart/cart-provider";
import { StoreHeader } from "@/components/catalog/store-header";
import { catalogCanvas } from "@/components/landing/catalog-shared";
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

  let name = "";
  let email = "";
  let customerNumber = "";
  let message = "";

  try {
    const response = await privateCustomersApi.getProfile(session.accessToken);
    const profile = response.data;
    if (!response.success || !profile) {
      message = response.message || "Could not load your profile.";
    } else {
      name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
      email = profile.emailAddress;
      customerNumber = profile.customerNumber;
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
          {email ? (
            <dl className="mt-6 space-y-4 rounded-[18px] border border-[#eceef3] bg-white p-6">
              <div>
                <dt className="text-[13px] text-[#8d939c]">Name</dt>
                <dd className="mt-1 text-[16px] text-[#1c1f24]">{name || "Not added yet"}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#8d939c]">Email</dt>
                <dd className="mt-1 text-[16px] text-[#1c1f24]">{email}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#8d939c]">Customer number</dt>
                <dd className="mt-1 text-[16px] text-[#1c1f24]">{customerNumber}</dd>
              </div>
            </dl>
          ) : null}
        </section>
      </main>
    </CartProvider>
  );
}

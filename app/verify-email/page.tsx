import type { Metadata } from "next";
import { CustomerAuthScreen } from "@/components/auth/customer-auth-screen";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const params = await searchParams;
  return <CustomerAuthScreen view="verify" nextPath={params.next} email={params.email} />;
}

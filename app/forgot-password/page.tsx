import type { Metadata } from "next";
import { CustomerAuthScreen } from "@/components/auth/customer-auth-screen";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <CustomerAuthScreen view="forgot" nextPath={params.next} />;
}

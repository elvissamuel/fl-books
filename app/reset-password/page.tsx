import type { Metadata } from "next";
import { CustomerAuthScreen } from "@/components/auth/customer-auth-screen";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; email?: string }>;
}) {
  const params = await searchParams;
  return <CustomerAuthScreen view="reset" nextPath={params.next} email={params.email} />;
}

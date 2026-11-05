import type { Metadata } from "next";
import { CustomerAuthScreen } from "@/components/auth/customer-auth-screen";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <CustomerAuthScreen view="sign-up" nextPath={params.next} />;
}

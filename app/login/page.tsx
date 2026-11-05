import type { Metadata } from "next";
import { CustomerAuthScreen } from "@/components/auth/customer-auth-screen";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string }>;
}) {
  const params = await searchParams;
  return <CustomerAuthScreen view="sign-in" nextPath={params.next} notice={params.notice} />;
}

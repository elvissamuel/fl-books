import type { Metadata } from "next";
import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AdminLoginPage() {
  return <LoginScreen />;
}

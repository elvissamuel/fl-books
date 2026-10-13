import type { Metadata } from "next";
import { AdministrationScreen } from "@/components/administration/administration-screen";

export const metadata: Metadata = {
  title: "Administration",
};

export default function AdministrationPage() {
  return <AdministrationScreen />;
}

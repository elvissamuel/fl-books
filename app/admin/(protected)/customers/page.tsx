import type { Metadata } from "next";
import { CustomersScreen } from "@/components/customers/customers-screen";

export const metadata: Metadata = {
  title: "Customer",
};

export default function CustomersPage() {
  return <CustomersScreen />;
}

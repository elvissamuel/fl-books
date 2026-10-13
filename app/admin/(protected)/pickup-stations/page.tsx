import type { Metadata } from "next";
import { PickupStationsScreen } from "@/components/pickup-stations/pickup-stations-screen";

export const metadata: Metadata = {
  title: "Pickup Location",
};

export default function PickupStationsPage() {
  return <PickupStationsScreen />;
}

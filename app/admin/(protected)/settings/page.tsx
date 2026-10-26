import type { Metadata } from "next";
import { PlatformSettingsScreen } from "@/components/platform-settings/platform-settings-screen";

export const metadata: Metadata = {
  title: "Platform Settings",
};

export default function PlatformSettingsPage() {
  return <PlatformSettingsScreen />;
}

import type { Metadata } from "next";
import { AudienceScreen } from "@/components/audience/audience-screen";
import { isAudienceTab } from "@/components/audience/audience-tabs";

export const metadata: Metadata = {
  title: "Audience",
};

export default async function AudiencePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  return <AudienceScreen initialTab={isAudienceTab(tab) ? tab : "get-in-touch"} />;
}

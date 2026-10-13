import type { Metadata } from "next";
import { NewsletterScreen } from "@/components/newsletter/newsletter-screen";

export const metadata: Metadata = {
  title: "Newsletter",
};

export default function NewsletterPage() {
  return <NewsletterScreen />;
}

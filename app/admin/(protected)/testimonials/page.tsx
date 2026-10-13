import type { Metadata } from "next";
import { TestimonialsScreen } from "@/components/testimonials/testimonials-screen";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default function TestimonialsPage() {
  return <TestimonialsScreen />;
}

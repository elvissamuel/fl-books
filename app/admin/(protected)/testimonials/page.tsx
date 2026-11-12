import { redirect } from "next/navigation";

export default function TestimonialsPage() {
  redirect("/admin/audience?tab=testimonials");
}

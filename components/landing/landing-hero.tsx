import { HeroSlideshow } from "@/components/landing/hero-slideshow";
import { getCustomerSession } from "@/infrastructure/auth/customer-session";

export async function LandingHero() {
  const session = await getCustomerSession();
  return <HeroSlideshow signedIn={Boolean(session)} />;
}

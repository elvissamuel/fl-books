import { HeroSlideshow } from "@/components/landing/hero-slideshow";
import { getCustomerSession } from "@/infrastructure/auth/customer-session";
import { customerNavPhotoUrl } from "@/infrastructure/customers/customer-nav-photo";

export async function LandingHero() {
  const session = await getCustomerSession();
  const pictureUrl = session ? await customerNavPhotoUrl(session.accessToken) : "";
  return <HeroSlideshow signedIn={Boolean(session)} pictureUrl={pictureUrl} />;
}

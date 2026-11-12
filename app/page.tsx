import { CartProvider } from "@/components/cart/cart-provider";
import { AuthorBanner } from "@/components/landing/author-banner";
import { BestSellers } from "@/components/landing/best-sellers";
import { catalogCanvas } from "@/components/landing/catalog-shared";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { NewReleases } from "@/components/landing/new-releases";
import { ReaderStories } from "@/components/landing/reader-stories";
import { ShopByCategory } from "@/components/landing/shop-by-category";
import { WhyShop } from "@/components/landing/why-shop";
import { ptSerif } from "@/lib/public-font";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <CartProvider>
      <main className={`${ptSerif.className} landing-page`} style={{ backgroundColor: catalogCanvas }}>
        <LandingHero />
        <ShopByCategory />
        <NewReleases />
        <BestSellers />
        <AuthorBanner />
        <WhyShop />
        <ReaderStories />
        <LandingFooter />
      </main>
    </CartProvider>
  );
}

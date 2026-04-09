import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}

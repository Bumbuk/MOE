import { DatabaseErrorState } from "@/components/ui/database-error-state";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { getFeaturedProducts } from "@/lib/products";
import { DatabaseConnectionError } from "@/types/common";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts = null;
  let hasDatabaseError = false;

  try {
    featuredProducts = await getFeaturedProducts();
  } catch (error) {
    if (error instanceof DatabaseConnectionError) {
      hasDatabaseError = true;
    } else {
      throw error;
    }
  }

  if (hasDatabaseError || !featuredProducts) {
    return (
      <>
        <HeroSection />
        <DatabaseErrorState
          title="Популярные товары пока недоступны"
          description="Главная страница уже использует Prisma как источник данных. Сейчас проблема только в подключении к PostgreSQL."
        />
      </>
    );
  }

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}

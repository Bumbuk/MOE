import { CatalogPageContent } from "@/components/catalog/catalog-page-content";
import { DatabaseErrorState } from "@/components/ui/database-error-state";
import { getProducts } from "@/lib/products";
import { DatabaseConnectionError } from "@/types/common";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  let products = null;
  let hasDatabaseError = false;

  try {
    products = await getProducts();
  } catch (error) {
    if (error instanceof DatabaseConnectionError) {
      hasDatabaseError = true;
    } else {
      throw error;
    }
  }

  if (hasDatabaseError || !products) {
    return (
      <DatabaseErrorState
        title="Каталог временно недоступен"
        description="Каталог читает товары из PostgreSQL через Prisma. Запустите базу и выполните миграции с seed, чтобы наполнить витрину."
      />
    );
  }

  return <CatalogPageContent products={products} />;
}

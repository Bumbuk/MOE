import { CatalogPageContent } from "@/components/catalog/catalog-page-content";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getProducts();

  return <CatalogPageContent products={products} />;
}

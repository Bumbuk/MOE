import Link from "next/link";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/ui/container";
import type { ProductPreview } from "@/types/product";

type FeaturedProductsProps = {
  products: ProductPreview[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Выборка</p>
            <h2 className="mt-3 text-3xl font-semibold text-stone-950">Популярные товары</h2>
          </div>
          <Link href="/catalog" className="text-sm font-medium text-stone-700 hover:text-stone-950">
            Смотреть весь каталог
          </Link>
        </div>
        <ProductGrid products={products} className="mt-10" />
      </Container>
    </section>
  );
}

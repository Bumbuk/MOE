import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/ui/container";
import type { ProductPreview } from "@/types/product";

type CatalogPageContentProps = {
  products: ProductPreview[];
};

export function CatalogPageContent({ products }: CatalogPageContentProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Каталог</p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">Коллекция MOE</h1>
          <p className="mt-4 text-base leading-7 text-stone-700">
            Модели для повседневного гардероба: спокойные оттенки, мягкие ткани
            и силуэты, которые легко носить каждый день.
          </p>
        </div>
        <ProductGrid products={products} className="mt-10" />
      </Container>
    </section>
  );
}

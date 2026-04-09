import { ProductCard } from "@/components/catalog/product-card";
import { cn } from "@/lib/utils";
import type { ProductPreview } from "@/types/product";

type ProductGridProps = {
  products: ProductPreview[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-3", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

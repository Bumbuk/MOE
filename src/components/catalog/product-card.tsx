import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductPreview } from "@/types/product";

type ProductCardProps = {
  product: ProductPreview;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#f5efe6_0%,#dfe9e1_100%)] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{product.category.name}</p>
        <h3 className="mt-3 text-2xl font-semibold text-stone-950">{product.title}</h3>
        <p className="mt-3 text-sm leading-6 text-stone-700">{product.shortDescription}</p>
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-stone-950">{formatPrice(product.price)}</p>
          {product.oldPrice ? (
            <p className="text-sm text-stone-500 line-through">{formatPrice(product.oldPrice)}</p>
          ) : null}
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900 transition hover:border-stone-900"
        >
          Открыть
        </Link>
      </div>
    </article>
  );
}

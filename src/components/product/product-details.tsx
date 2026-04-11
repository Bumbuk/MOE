import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const firstColor = product.colors[0];
  const variants = firstColor?.variants ?? [];
  const currentPrice = variants[0]?.price ?? 0;
  const oldPrice = variants[0]?.oldPrice;
  const currentVariant = variants[0];
  const currentImage = firstColor?.images[0]?.path ?? product.images[0]?.path ?? "";

  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,#f5efe6_0%,#dfe9e1_100%)] p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{product.category.name}</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-950">{product.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-stone-700">{product.description}</p>
      </div>
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-3xl font-semibold text-stone-950">{formatPrice(currentPrice)}</p>
        {oldPrice ? <p className="mt-2 text-sm text-stone-500 line-through">{formatPrice(oldPrice)}</p> : null}
        <div className="mt-8 space-y-4 text-sm text-stone-700">
          <p>
            <span className="font-medium text-stone-950">Описание:</span> {product.shortDescription}
          </p>
          <p>
            <span className="font-medium text-stone-950">Состав:</span> {product.composition}
          </p>
          <p>
            <span className="font-medium text-stone-950">Особенности:</span> {product.certification}
          </p>
          <p>
            <span className="font-medium text-stone-950">Цвет:</span> {firstColor?.name ?? "Не указан"}
          </p>
        </div>
        <div className="mt-8">
          <p className="text-sm font-medium text-stone-950">Размеры</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => (
              <span
                key={variant.id}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700"
              >
                {variant.size}
              </span>
            ))}
          </div>
        </div>
        {currentVariant ? (
          <AddToCartButton
            productId={product.id}
            productColorId={firstColor?.id}
            slug={product.slug}
            title={product.title}
            colorName={firstColor?.name ?? "Base"}
            variantId={currentVariant.id}
            size={currentVariant.size}
            sku={currentVariant.sku}
            imagePath={currentImage}
            price={currentVariant.price}
          />
        ) : null}
      </div>
    </section>
  );
}

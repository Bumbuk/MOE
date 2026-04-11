"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  productId: string;
  productColorId?: string;
  slug: string;
  title: string;
  colorName: string;
  variantId: string;
  size: string;
  sku?: string;
  imagePath: string;
  price: number;
};

export function AddToCartButton(props: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      productId: props.productId,
      productColorId: props.productColorId,
      variantId: props.variantId,
      product: {
        productId: props.productId,
        productColorId: props.productColorId,
        productVariantId: props.variantId,
        slug: props.slug,
        title: props.title,
        colorName: props.colorName,
        size: props.size,
        sku: props.sku,
        imagePath: props.imagePath,
        price: props.price,
      },
    });

    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
    >
      {isAdded ? "Добавлено в корзину" : "Добавить в корзину"}
    </button>
  );
}

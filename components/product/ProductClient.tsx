"use client";

import { useMemo, useState } from "react";
import ProductGallery from "./ProductGallery";
import AddToCart from "../cart/AddToCart";

type Variant = {
  id: string;
  size: string;
  price: number;
  stock: number | null;
  status: "ACTIVE" | "HIDDEN";
};

type Color = {
  id: string;
  name: string;
  slug: string;
  images: { url: string; alt: string | null }[];
  variants: Variant[];
};

type Props = {
  product: {
    slug: string;
    title: string;
    category: string | null;
    description: string;
    status?: string;
    colors: Color[];
  };
};

export default function ProductClient({ product }: Props) {
  // Оставляем только цвета, где есть активные варианты
  const visibleColors = useMemo(() => {
    return (product.colors ?? [])
      .map((c) => ({
        ...c,
        variants: (c.variants ?? []).filter((v) => v.status === "ACTIVE"),
      }))
      .filter((c) => (c.variants ?? []).length > 0);
  }, [product.colors]);

  const [colorSlug, setColorSlug] = useState<string>(visibleColors[0]?.slug ?? "");

  const activeColor = useMemo(() => {
    return visibleColors.find((c) => c.slug === colorSlug) ?? visibleColors[0];
  }, [visibleColors, colorSlug]);

  // ВАЖНО: ProductGallery должен получать string[] (url), а не objects!
  const galleryImages = useMemo(() => {
    return (activeColor?.images ?? [])
      .map((i) => i?.url)
      .filter((u): u is string => typeof u === "string" && u.length > 0);
  }, [activeColor]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* ЛЕВО: Галерея */}
        <ProductGallery images={galleryImages} title={product.title} />

        {/* ПРАВО: Информация + покупка */}
        <div className="space-y-5">
          <div>
            <div className="text-sm text-neutral-500">{product.category ?? ""}</div>
            <h1 className="mt-1 text-3xl font-semibold text-neutral-100">{product.title}</h1>
            {typeof product.status === "string" ? (
              <div className="mt-2 text-xs text-neutral-600">Статус: {product.status}</div>
            ) : null}
          </div>

          <AddToCart
            productSlug={product.slug}
            productTitle={product.title}
            colors={visibleColors}
            colorSlug={colorSlug}
            onColorChange={setColorSlug}
          />

          {product.description ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <div className="text-sm font-medium text-neutral-200 mb-2">Описание</div>
              <div className="whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                {product.description}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import AddToCart from "../cart/AddToCart";
import ProductGallery from "./ProductGallery";

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
    composition?: string | null;
    certification?: string | null;
    colors: Color[];
  };
};

function hasAvailableVariant(variants: Variant[]) {
  return variants.some((v) => v.status === "ACTIVE" && (v.stock == null || v.stock > 0));
}

export default function ProductClient({ product }: Props) {
  const visibleColors = useMemo(() => {
    const normalized = (product.colors ?? [])
      .map((c) => ({
        ...c,
        variants: (c.variants ?? []).filter((v) => v.status === "ACTIVE"),
      }))
      .filter((c) => c.variants.length > 0);

    const availableOnly = normalized.filter((c) => hasAvailableVariant(c.variants));
    return availableOnly.length > 0 ? availableOnly : normalized;
  }, [product.colors]);

  // По умолчанию выбираем первый доступный цвет.
  const [colorSlug, setColorSlug] = useState(visibleColors[0]?.slug ?? "");
  const activeColor = useMemo(
    () => visibleColors.find((c) => c.slug === colorSlug) ?? visibleColors[0],
    [visibleColors, colorSlug]
  );
  const images = useMemo(
    () => (activeColor?.images ?? []).map((item) => item.url).filter((src): src is string => Boolean(src)),
    [activeColor]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="space-y-6">
          <ProductGallery images={images} title={product.title} />

          {(product.composition || product.certification) && (
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              {product.composition && (
                <p className="text-sm text-black/65">
                  <span className="font-semibold text-[#2E4C9A]">Состав:</span> {product.composition}
                </p>
              )}
              {product.certification && (
                <p className="mt-3 text-sm text-black/65">
                  <span className="font-semibold text-[#2E4C9A]">Сертификация:</span> {product.certification}
                </p>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div>
            <div className="text-xs text-black/45">{product.category ?? ""}</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#2E4C9A]">{product.title}</h1>
          </div>

          <AddToCart
            productSlug={product.slug}
            productTitle={product.title}
            colors={visibleColors}
            colorSlug={colorSlug}
            onColorChange={setColorSlug}
          />

          {product.description ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm leading-6 text-black/65">{product.description}</div>
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

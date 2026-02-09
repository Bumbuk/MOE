"use client";

import { useMemo, useState } from "react";
import ProductGallery from "./ProductGallery";
import AddToCart from "../cart/AddToCart";

/*
 * Клиентский компонент страницы товара. Управляет выбранным цветом,
 * отображает галерею изображений и блок добавления в корзину. За расчёт
 * цены и обработку вариантов отвечает AddToCart.
 */

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

export default function ProductClient({ product }: Props) {
  // Отфильтровываем цвета, в которых есть хотя бы один активный вариант.
  const visibleColors = useMemo(() => {
    return (product.colors ?? [])
      .map((c) => ({
        ...c,
        variants: (c.variants ?? []).filter((v) => v.status === "ACTIVE"),
      }))
      .filter((c) => (c.variants ?? []).length > 0);
  }, [product.colors]);

  // slug выбранного цвета. По умолчанию берём первый доступный цвет.
  const [colorSlug, setColorSlug] = useState<string>(visibleColors[0]?.slug ?? "");

  // Активный цвет исходя из slug.
  const activeColor = useMemo(() => {
    return visibleColors.find((c) => c.slug === colorSlug) ?? visibleColors[0];
  }, [visibleColors, colorSlug]);

  // Галерея принимает только массив URL. Отфильтровываем пустые значения.
  const galleryImages = useMemo(() => {
    return (activeColor?.images ?? [])
      .map((i) => i.url)
      .filter((u): u is string => typeof u === "string" && u.length > 0);
  }, [activeColor]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Левая колонка: галерея и описание */}
        <div className="space-y-6">
          <ProductGallery images={galleryImages} title={product.title} />

          {/*
            Composition / Certification — отдельные пункты сразу под фото.
            Показываем блок только если есть хотя бы одно поле.
          */}
          {(product.composition || product.certification) ? (
            <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4">
              <div className="text-sm font-medium text-[#4B7488] mb-2">Детали</div>
              <ul className="space-y-2 text-sm leading-6 text-[#2D2C2A]">
                {product.composition ? (
                  <li>
                    <span className="text-[#4B7488]">Composition:</span>{" "}
                    <span className="whitespace-pre-wrap">{product.composition}</span>
                  </li>
                ) : null}
                {product.certification ? (
                  <li>
                    <span className="text-[#4B7488]">Certification:</span>{" "}
                    <span className="whitespace-pre-wrap">{product.certification}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {product.description ? (
            <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4">
              <div className="text-sm font-medium text-[#4B7488] mb-2">Описание</div>
              <div className="whitespace-pre-wrap text-sm leading-6 text-[#2D2C2A]">
                {product.description}
              </div>
            </div>
          ) : null}
        </div>

        {/* Правая колонка: информация о товаре и блок покупки */}
        <div className="space-y-5">
          <div>
            <div className="text-sm text-[#4B7488]">{product.category ?? ""}</div>
            <h1 className="mt-1 text-3xl font-semibold text-[#2D2C2A]">{product.title}</h1>
          </div>

          <AddToCart
            productSlug={product.slug}
            productTitle={product.title}
            colors={visibleColors}
            colorSlug={colorSlug}
            onColorChange={setColorSlug}
          />
        </div>
      </div>
    </div>
  );
}

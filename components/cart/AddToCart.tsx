"use client";

import { useMemo, useState } from "react";
import { useCartStore } from "../../lib/client/cart-store";

type Variant = {
  id: string;
  size: string;
  price: number;          // у тебя это "рубли" как number (по скринам)
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
  productSlug: string;
  productTitle: string;
  colors: Color[];

  colorSlug: string;
  onColorChange: (slug: string) => void;
};

function formatRub(value: number) {
  const n = Math.round(value);
  return `${n.toLocaleString("ru-RU")} ₽`;
}

export default function AddToCart({
  productSlug,
  productTitle,
  colors,
  colorSlug,
  onColorChange,
}: Props) {
  const visibleColors = useMemo(() => {
    return (colors ?? [])
      .map((c) => ({
        ...c,
        variants: (c.variants ?? []).filter((v) => v.status === "ACTIVE"),
      }))
      .filter((c) => (c.variants ?? []).length > 0);
  }, [colors]);

  const color = useMemo(() => {
    return visibleColors.find((c) => c.slug === colorSlug) ?? visibleColors[0];
  }, [visibleColors, colorSlug]);

  const sizes = useMemo(() => {
    return (color?.variants ?? []).slice().sort((a, b) => {
      const an = Number(a.size);
      const bn = Number(b.size);
      const aIsNum = Number.isFinite(an);
      const bIsNum = Number.isFinite(bn);
      if (aIsNum && bIsNum) return an - bn;
      return a.size.localeCompare(b.size, "ru");
    });
  }, [color]);

  const [sizeId, setSizeId] = useState<string>(sizes[0]?.id ?? "");
  const [qty, setQty] = useState<number>(1);

  const activeVariant = useMemo(() => {
    return sizes.find((v) => v.id === sizeId) ?? sizes[0];
  }, [sizes, sizeId]);

  // ✅ ВАЖНО: твой cart-store хранит priceRub (рубли), не "копейки".
  const priceRub = useMemo(() => activeVariant?.price ?? 0, [activeVariant]);
  const stock = useMemo(() => activeVariant?.stock ?? null, [activeVariant]);

  const addItem = useCartStore((s) => s.addItem);

  const canAdd = Boolean(color && activeVariant && qty > 0);

  function onAdd() {
    if (!canAdd || !color || !activeVariant) return;

    addItem({
      variantId: activeVariant.id,
      title: productTitle,
      slug: productSlug,
      color: color.name,
      size: activeVariant.size,
      priceRub: priceRub,
      imageUrl: color.images?.[0]?.url ?? undefined,
      qty,
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
      {/* ЦВЕТ (мини-карточки как на "хорошем" скрине) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-neutral-200">Цвет</div>
          <div className="text-sm text-neutral-500">{color?.name ?? ""}</div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {visibleColors.map((c) => {
            const thumb = c.images?.[0]?.url ?? "";
            const active = c.slug === (color?.slug ?? "");

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onColorChange(c.slug);
                  const first = (c.variants ?? []).find((v) => v.status === "ACTIVE");
                  setSizeId(first?.id ?? "");
                  setQty(1);
                }}
                className={
                  "w-24 flex-shrink-0 rounded-xl border p-2 text-left transition " +
                  (active
                    ? "border-neutral-200 bg-neutral-900"
                    : "border-neutral-800 bg-neutral-950 hover:border-neutral-700")
                }
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                      Нет фото
                    </div>
                  )}
                </div>
                <div className="mt-2 truncate text-xs text-neutral-300">{c.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* РАЗМЕР */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-neutral-200">Выберите размер</div>

        <div className="flex flex-wrap gap-2">
          {sizes.map((v) => {
            const active = v.id === (activeVariant?.id ?? "");
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSizeId(v.id)}
                className={
                  "rounded-full border px-3 py-1 text-sm transition " +
                  (active
                    ? "border-neutral-200 bg-neutral-900 text-neutral-100"
                    : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700")
                }
              >
                {v.size}
              </button>
            );
          })}
        </div>

        {typeof stock === "number" ? (
          <div className="text-xs text-neutral-500">В наличии: {stock}</div>
        ) : null}
      </div>

      {/* ЦЕНА + КОЛ-ВО + КНОПКА */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
        <div className="flex items-end justify-between">
          <div className="text-sm text-neutral-500">Цена</div>
          <div className="text-xl font-semibold text-neutral-100">{formatRub(priceRub)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">Количество</div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((x) => Math.max(1, x - 1))}
              className="h-9 w-9 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-700"
            >
              −
            </button>

            <div className="w-10 text-center text-neutral-100">{qty}</div>

            <button
              type="button"
              onClick={() => setQty((x) => x + 1)}
              className="h-9 w-9 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-700"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!canAdd}
          onClick={onAdd}
          className={
            "w-full rounded-xl px-4 py-3 font-medium transition " +
            (canAdd
              ? "bg-neutral-100 text-neutral-950 hover:bg-white"
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed")
          }
        >
          Добавить в корзину
        </button>

        <div className="text-xs text-neutral-600">
          Итог: {formatRub(priceRub * qty)}
        </div>
      </div>
    </div>
  );
}
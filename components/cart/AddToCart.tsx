"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "../../lib/cart-store";
import { formatRub } from "../../lib/constants";

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
  productSlug: string;
  productTitle: string;
  colors: Color[];
  colorSlug: string;
  onColorChange: (slug: string) => void;
};

type FlyState = {
  show: boolean;
  left: number;
  top: number;
  targetLeft: number;
  targetTop: number;
  animate: boolean;
};

function isAvailable(variant: Variant) {
  return variant.stock == null || variant.stock > 0;
}

export default function AddToCart({ productSlug, productTitle, colors, colorSlug, onColorChange }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  const [fly, setFly] = useState<FlyState>({
    show: false,
    left: 0,
    top: 0,
    targetLeft: 0,
    targetTop: 0,
    animate: false,
  });
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);

  const visibleColors = useMemo(
    () =>
      (colors ?? [])
        .map((color) => ({
          ...color,
          variants: (color.variants ?? []).filter((variant) => variant.status === "ACTIVE"),
        }))
        .filter((color) => color.variants.length > 0),
    [colors]
  );

  const color = useMemo(
    () => visibleColors.find((item) => item.slug === colorSlug) ?? visibleColors[0],
    [visibleColors, colorSlug]
  );

  const sizes = useMemo(
    () =>
      [...(color?.variants ?? [])].sort((a, b) => {
        const an = Number(a.size);
        const bn = Number(b.size);
        if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
        return a.size.localeCompare(b.size, "ru");
      }),
    [color]
  );

  const firstAvailableVariant = useMemo(() => sizes.find(isAvailable) ?? sizes[0], [sizes]);
  const selectedVariantId = sizes.some((item) => item.id === variantId) ? variantId : (firstAvailableVariant?.id ?? "");
  const activeVariant = useMemo(
    () => sizes.find((item) => item.id === selectedVariantId) ?? firstAvailableVariant,
    [sizes, selectedVariantId, firstAvailableVariant]
  );

  useEffect(() => {
    if (!addedFeedback) return;
    const timer = setTimeout(() => setAddedFeedback(false), 1200);
    return () => clearTimeout(timer);
  }, [addedFeedback]);

  const stock = activeVariant?.stock ?? null;
  const priceRub = activeVariant?.price ?? 0;
  const currentInCart = useMemo(() => {
    const item = cartItems.find((entry) => entry.variantId === activeVariant?.id);
    return item?.qty ?? 0;
  }, [cartItems, activeVariant?.id]);
  const availableStock = stock == null ? Number.MAX_SAFE_INTEGER : Math.max(0, stock - currentInCart);
  const canAdd = Boolean(color && activeVariant && availableStock > 0 && qty > 0);

  function animateToCart() {
    const sourceRect = addButtonRef.current?.getBoundingClientRect();
    const cartRect = document.getElementById("site-cart-button")?.getBoundingClientRect();
    if (!sourceRect || !cartRect) return;

    const startLeft = sourceRect.left + sourceRect.width / 2;
    const startTop = sourceRect.top + sourceRect.height / 2;
    const targetLeft = cartRect.left + cartRect.width / 2;
    const targetTop = cartRect.top + cartRect.height / 2;

    setFly({ show: true, left: startLeft, top: startTop, targetLeft, targetTop, animate: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setFly((prev) => ({ ...prev, animate: true }))));
    window.setTimeout(() => setFly((prev) => ({ ...prev, show: false, animate: false })), 650);
  }

  function handleAdd() {
    if (!canAdd || !color || !activeVariant) return;
    const amount = Math.min(qty, availableStock);

    addItem({
      variantId: activeVariant.id,
      title: productTitle,
      slug: productSlug,
      color: color.name,
      size: activeVariant.size,
      priceRub,
      imageUrl: color.images?.[0]?.url ?? undefined,
      stock,
      qty: amount,
    });

    setQty(1);
    setAddedFeedback(true);
    animateToCart();
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      {fly.show && (
        <span
          className={"cart-fly-dot" + (fly.animate ? " cart-fly-dot--go" : "")}
          style={{
            ["--start-x" as string]: `${fly.left}px`,
            ["--start-y" as string]: `${fly.top}px`,
            ["--end-x" as string]: `${fly.targetLeft}px`,
            ["--end-y" as string]: `${fly.targetTop}px`,
          }}
        />
      )}

      <div className="text-sm font-semibold tracking-wide text-[#2E4C9A]">{productTitle}</div>
      <div className="mt-3 text-sm font-semibold text-[#2E4C9A]">{formatRub(priceRub)}</div>
      <div className="mt-2 text-xs text-black/40">Цена за единицу</div>

      <div className="mt-6">
        <div className="text-xs text-black/35">Цвет</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleColors.map((item) => {
            const active = item.slug === color?.slug;
            const image = item.images[0]?.url ?? null;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onColorChange(item.slug);
                  setQty(1);
                }}
                className={
                  "relative h-14 w-14 overflow-hidden rounded-md border " +
                  (active ? "border-[#2E4C9A]/60" : "border-black/10 hover:border-black/25")
                }
                title={item.name}
              >
                {image ? (
                  <Image src={image} alt={item.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <span className="text-[10px] text-black/40">нет фото</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-black/35">Размер</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((item) => {
            const outOfStock = !isAvailable(item);
            const active = item.id === selectedVariantId;
            return (
              <button
                key={item.id}
                type="button"
                disabled={outOfStock}
                onClick={() => setVariantId(item.id)}
                className={
                  "h-11 min-w-[46px] border px-3 text-xs " +
                  (active
                    ? "border-[#2E4C9A]/60 bg-[#2E4C9A]/5"
                    : outOfStock
                    ? "border-black/10 text-black/30"
                    : "border-black/15 hover:bg-black/5")
                }
              >
                {item.size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setQty((value) => Math.max(1, value - 1))}
          className="h-10 w-10 rounded-full border border-black/15 hover:bg-black/5"
        >
          -
        </button>
        <div className="w-10 text-center text-sm">{qty}</div>
        <button
          type="button"
          onClick={() => setQty((value) => Math.min(availableStock, value + 1))}
          className="h-10 w-10 rounded-full border border-black/15 hover:bg-black/5"
        >
          +
        </button>
      </div>

      {typeof stock === "number" && <div className="mt-3 text-xs text-black/45">В наличии: {availableStock}</div>}

      <button
        ref={addButtonRef}
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className={
          "mt-6 h-12 w-full rounded-md text-xs font-semibold tracking-wide " +
          (canAdd ? "bg-black/15 hover:bg-black/20" : "bg-black/10 text-black/35")
        }
      >
        {addedFeedback ? "Товар добавлен в корзину" : "Добавить в корзину"}
      </button>
    </div>
  );
}

"use client";

/*
 * Компонент добавления в корзину для страницы товара. Здесь находится логика
 * выбора цвета, размера, количества и отображения цены. После добавления
 * товара выводится небольшое уведомление, чтобы пользователь увидел
 * результат действия. Цвет кнопок и фона соответствует фирменной палитре.
 */

import { useEffect, useMemo, useState } from "react";
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
  /**
   * slug текущего выбранного цвета. Передаётся сверху, чтобы синхронизировать
   * выбор цвета с галереей.
   */
  colorSlug: string;
  /**
   * Функция для изменения цвета. Вызывается при выборе нового цвета.
   */
  onColorChange: (slug: string) => void;
};

export default function AddToCart({ productSlug, productTitle, colors, colorSlug, onColorChange }: Props) {
  // Получаем доступ к корзине: список товаров и функцию добавления.
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  // Видим только цвета с хотя бы одним активным вариантом.
  const visibleColors = useMemo(() => {
    return (colors ?? [])
      .map((c) => ({
        ...c,
        variants: (c.variants ?? []).filter((v) => v.status === "ACTIVE"),
      }))
      .filter((c) => (c.variants ?? []).length > 0);
  }, [colors]);

  // Текущий цвет (по slug). Если slug отсутствует или неправильный, берём первый доступный.
  const color = useMemo(() => {
    return visibleColors.find((c) => c.slug === colorSlug) ?? visibleColors[0];
  }, [visibleColors, colorSlug]);

  // Сортируем варианты внутри цвета по размеру (если размер числовой — по числу, иначе по строке).
  const sizes = useMemo(() => {
    return ((color?.variants ?? []).slice()).sort((a, b) => {
      const an = Number(a.size);
      const bn = Number(b.size);
      const aNum = Number.isFinite(an);
      const bNum = Number.isFinite(bn);
      if (aNum && bNum) return an - bn;
      return a.size.localeCompare(b.size, "ru");
    });
  }, [color]);

  // Выбранный вариант (по id) и количество.
  const [variantId, setVariantId] = useState<string>(sizes[0]?.id ?? "");
  const [qty, setQty] = useState<number>(1);

  // Найдём активный вариант по id. Если ничего не выбрано — берём первый.
  const activeVariant = useMemo(() => {
    return sizes.find((v) => v.id === variantId) ?? sizes[0];
  }, [sizes, variantId]);

  const priceRub = activeVariant?.price ?? 0;
  const stock = activeVariant?.stock ?? null;
  // Текущее количество этого варианта уже в корзине.
  const currentInCart = useMemo(() => {
    const item = cartItems.find((it) => it.variantId === activeVariant?.id);
    return item?.qty ?? 0;
  }, [cartItems, activeVariant?.id]);
  // Сколько ещё можно добавить: остаток минус уже лежащее в корзине. Если stock == null, то бесконечность.
  const availableStock = stock == null ? Number.MAX_SAFE_INTEGER : Math.max(0, stock - currentInCart);
  // Разрешаем добавление, если выбран цвет и вариант, и остаток > 0, и qty > 0.
  const canAdd = Boolean(color && activeVariant && availableStock > 0 && qty > 0);

  // Состояние для показа уведомления "добавлено".
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(t);
  }, [showToast]);

  function handleColorSelect(slug: string) {
    onColorChange(slug);
    // При смене цвета сбрасываем выбранный размер и количество
    const newColor = visibleColors.find((c) => c.slug === slug);
    const firstVariant = newColor?.variants?.[0];
    setVariantId(firstVariant?.id ?? "");
    setQty(1);
  }

  function onAdd() {
    if (!canAdd || !color || !activeVariant) return;
    // Перекрываем количество: нельзя добавить больше доступного.
    const qtyToAdd = Math.min(qty, availableStock);
    addItem({
      variantId: activeVariant.id,
      title: productTitle,
      slug: productSlug,
      color: color.name,
      size: activeVariant.size,
      priceRub: priceRub,
      imageUrl: color.images?.[0]?.url ?? undefined,
      stock: stock,
      qty: qtyToAdd,
    });
    // Показываем уведомление и сбрасываем количество в 1 для следующего добавления.
    setShowToast(true);
    setQty(1);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4">
      {/* Цвета: мини-превью с названием. Горизонтальный скролл если много цветов. */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-[#4B7488]">Цвет</div>
          <div className="text-sm text-[#4B7488]">{color?.name ?? ""}</div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {visibleColors.map((c) => {
            const thumb = c.images?.[0]?.url ?? "";
            const active = c.slug === (color?.slug ?? "");
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorSelect(c.slug)}
                className={
                  "w-24 flex-shrink-0 rounded-xl border p-2 text-left transition " +
                  (active
                    ? "border-[#F9B44D] bg-[#F9B44D]/20"
                    : "border-[#F9B44D] bg-[var(--background)] hover:border-[#EC99A6]")
                }
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--background)]">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#4B7488]">
                      Нет фото
                    </div>
                  )}
                </div>
                <div className="mt-2 truncate text-xs text-[#4B7488]">{c.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Размеры: кнопки со значениями. Неактивные варианты серые. */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-[#4B7488]">Размер</div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((v) => {
            const outOfStock = (v.stock ?? 0) <= 0;
            const active = v.id === (activeVariant?.id ?? "");
            return (
              <button
                key={v.id}
                type="button"
                disabled={outOfStock}
                onClick={() => setVariantId(v.id)}
                className={
                  "rounded-full border px-3 py-1 text-sm transition " +
                  (active
                    ? "border-[#F9B44D] bg-[#F9B44D]/20 text-[#FF6634]"
                    : outOfStock
                    ? "border-[#EADDCB] bg-[#F5E5D4] text-[#AAA19C] cursor-not-allowed"
                    : "border-[#F9B44D] bg-[var(--background)] text-[#4B7488] hover:border-[#EC99A6]")
                }
              >
                {v.size}
                {outOfStock ? " (нет)" : ""}
              </button>
            );
          })}
        </div>
        {typeof stock === "number" ? (
          <div className="text-xs text-[#4B7488]">В наличии: {availableStock}</div>
        ) : null}
      </div>

      {/* Цена, количество и итог */}
      <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4 space-y-3">
        <div className="flex items-end justify-between">
          <div className="text-sm text-[#4B7488]">Цена</div>
          <div className="text-xl font-semibold text-[#FF6634]">{formatRub(priceRub)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#4B7488]">Количество</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((x) => Math.max(1, x - 1))}
              className="h-9 w-9 rounded-full border border-[#F9B44D] bg-[var(--background)] text-[#FF6634] hover:bg-[#FDE9D4]"
            >
              −
            </button>
            <div className="w-10 text-center text-[#2D2C2A]">{qty}</div>
            <button
              type="button"
              onClick={() =>
                setQty((x) => {
                  // Прибавляем количество, но не превышаем доступный остаток
                  const maxQty = availableStock;
                  return Math.min(maxQty, x + 1);
                })
              }
              className="h-9 w-9 rounded-full border border-[#F9B44D] bg-[var(--background)] text-[#FF6634] hover:bg-[#FDE9D4]"
            >
              +
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!canAdd}
          className={
            "w-full rounded-xl px-4 py-3 font-medium transition " +
            (canAdd
              ? "bg-[#FF6634] text-white hover:bg-[#EC99A6]"
              : "bg-[#EADDCB] text-[#AAA19C] cursor-not-allowed")
          }
        >
          {canAdd ? "Добавить в корзину" : "Нет в наличии"}
        </button>
        {/* Итог: выводим цену за 1 единицу, как просил пользователь */}
        <div className="text-xs text-[#4B7488]">Итого: {formatRub(priceRub)}</div>
        {/* Уведомление об успешном добавлении */}
        {showToast ? (
          <div className="mt-2 text-sm text-[#F9B44D] animate-pulse">Товар добавлен в корзину</div>
        ) : null}
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartStore } from "../../lib/client/cart-store";
import Button from "../ui/Button";
import { formatRub } from "../../lib/shared/constants";
import { FREE_DELIVERY_FROM_RUB, DeliveryMethod } from "../../lib/shared/delivery";

type CheckoutForm = {
  fullName: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  comment: string;
};

type OrderItemPayload = { variantId: string; qty: number };

type PostOrderPayload = {
  fullName: string;
  phone: string;
  comment?: string | null;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string | null;
  items: OrderItemPayload[];
};

type OrderResponse = { orderId: string } | { error: string; variantId?: string };

async function postOrder(payload: PostOrderPayload): Promise<OrderResponse> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as OrderResponse;
}

export default function CartClient() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    deliveryMethod: "CDEK",
    deliveryAddress: "",
    comment: "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.priceRub * it.qty, 0), [items]);

  const needAddress = form.deliveryMethod !== "PICKUP";

  const canCheckout =
    items.length > 0 &&
    form.fullName.trim().length > 0 &&
    form.phone.trim().length >= 5 &&
    (!needAddress || form.deliveryAddress.trim().length > 0);

  async function checkout() {
    if (!canCheckout || pending) return;

    setPending(true);
    setError(null);
    setSuccessId(null);

    const payload: PostOrderPayload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      comment: form.comment.trim() || null,
      deliveryMethod: form.deliveryMethod,
      deliveryAddress: form.deliveryMethod === "PICKUP" ? null : form.deliveryAddress.trim(),
      items: items.map((it) => ({ variantId: it.variantId, qty: it.qty })),
    };

    try {
      const data = await postOrder(payload);
      if ("orderId" in data) {
        setSuccessId(data.orderId);
        clear();
        return;
      }
      setError(data.error || "ORDER_FAILED");
    } catch {
      setError("ORDER_FAILED");
    } finally {
      setPending(false);
    }
  }

  const inputBase =
    "mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-800";

  if (successId) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="text-2xl font-semibold">Заказ оформлен</h1>
        <p className="mt-2 text-neutral-300">
          Номер заказа: <span className="font-mono text-neutral-100">{successId}</span>
        </p>
        <Link href="/" className="mt-4 inline-block underline text-neutral-200">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-semibold">Корзина</h1>

      {items.length === 0 ? (
        <p className="mt-4 text-neutral-500">Корзина пуста.</p>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="space-y-3 md:col-span-2">
            {items.map((it) => (
              <div key={it.variantId} className="flex gap-3 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/30">
                  {it.imageUrl ? <Image src={it.imageUrl} alt={it.title} fill className="object-cover" /> : null}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="line-clamp-2 font-medium leading-snug text-neutral-100">{it.title}</div>
                      <div className="mt-1 text-sm text-neutral-400">
                        Цвет: {it.color} • Размер: {it.size}
                      </div>
                      <div className="mt-1 text-sm text-neutral-300">{formatRub(it.priceRub)} / шт</div>
                    </div>
                    <button
                      className="text-sm text-neutral-500 hover:text-neutral-200"
                      onClick={() => removeItem(it.variantId)}
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="h-9 w-9 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                      onClick={() => setQty(it.variantId, it.qty - 1)}
                    >
                      −
                    </button>
                    <div className="min-w-8 text-center text-neutral-200">{it.qty}</div>
                    <button
                      className="h-9 w-9 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                      onClick={() => setQty(it.variantId, it.qty + 1)}
                    >
                      +
                    </button>
                    <div className="ml-auto font-medium text-neutral-100">{formatRub(it.priceRub * it.qty)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4">
            <div className="text-sm text-neutral-400">
              Доставка бесплатно от <b className="text-neutral-100">{FREE_DELIVERY_FROM_RUB} ₽</b>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-neutral-400">Товары</span>
              <span className="font-medium text-neutral-100">{formatRub(subtotal)}</span>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="text-sm text-neutral-500">ФИО</div>
                <input className={inputBase} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </label>

              <label className="block">
                <div className="text-sm text-neutral-500">Телефон</div>
                <input className={inputBase} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>

              <label className="block">
                <div className="text-sm text-neutral-500">Способ доставки</div>
                <select
                  className={inputBase}
                  value={form.deliveryMethod}
                  onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value as DeliveryMethod, deliveryAddress: "" })}
                >
                  <option value="CDEK">СДЭК</option>
                  <option value="YANDEX">Яндекс Доставка</option>
                  <option value="PICKUP">Самовывоз (Казань)</option>
                </select>
              </label>

              {needAddress ? (
                <label className="block">
                  <div className="text-sm text-neutral-500">
                    {form.deliveryMethod === "CDEK" ? "Адрес пункта СДЭК" : "Адрес Яндекс Доставка"}
                  </div>
                  <input
                    className={inputBase}
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                  />
                </label>
              ) : null}

              <label className="block">
                <div className="text-sm text-neutral-500">Комментарий (необязательно)</div>
                <textarea
                  className={inputBase}
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
              </label>

              {error ? <div className="text-sm text-red-400">Ошибка: {error}</div> : null}

              <Button disabled={!canCheckout || pending} onClick={checkout} className="w-full">
                {pending ? "Оформляем..." : "Оформить заказ"}
              </Button>

              <button
                className="w-full text-sm text-neutral-500 hover:text-neutral-200"
                onClick={() => clear()}
                type="button"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

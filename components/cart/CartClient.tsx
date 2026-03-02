"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCartStore } from "../../lib/cart-store";
import { formatRub } from "../../lib/constants";
import { DeliveryMethod, FREE_DELIVERY_FROM_RUB } from "../../lib/delivery";

type CheckoutForm = {
  fullName: string;
  phone: string;
  city: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  comment: string;
};

type PostOrderPayload = {
  fullName: string;
  phone: string;
  city: string;
  comment?: string | null;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string | null;
  items: Array<{ variantId: string; qty: number }>;
};

type OrderResponse = { orderId: string } | { error: string; variantId?: string };

async function postOrder(payload: PostOrderPayload): Promise<OrderResponse> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await response.json()) as OrderResponse;
}

function formatPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = digits.slice(1);
  if (digits.startsWith("7")) digits = digits.slice(1);

  let result = "+7";
  if (digits.length > 0) result += " ";
  result += digits.slice(0, 3);
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result.trim();
}

export default function CartClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    city: "",
    deliveryMethod: "CDEK",
    deliveryAddress: "",
    comment: "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.priceRub * item.qty, 0), [items]);
  const needAddress = form.deliveryMethod !== "PICKUP";
  const fullNameValid = form.fullName.trim().split(/\s+/).filter(Boolean).length === 3;
  const phoneValid = /^\+7\s?\d{3}\s?\d{3}-\d{2}-\d{2}$/.test(form.phone.trim());
  const cityValid = form.city.trim().length > 0;
  const addressValid = form.deliveryAddress.trim().length > 0;

  const canCheckout =
    items.length > 0 && fullNameValid && phoneValid && cityValid && (!needAddress || addressValid);

  async function checkout() {
    if (!canCheckout || pending) return;
    setPending(true);
    setError(null);
    setSuccessId(null);

    const payload: PostOrderPayload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      comment: form.comment.trim() || null,
      deliveryMethod: form.deliveryMethod,
      deliveryAddress: needAddress ? form.deliveryAddress.trim() : null,
      items: items.map((item) => ({ variantId: item.variantId, qty: item.qty })),
    };

    try {
      const data = await postOrder(payload);
      if ("orderId" in data) {
        setSuccessId(data.orderId);
        clear();
      } else {
        setError(data.error || "ORDER_FAILED");
      }
    } catch {
      setError("ORDER_FAILED");
    } finally {
      setPending(false);
    }
  }

  if (successId) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2E4C9A]">Заказ оформлен</h1>
        <p className="mt-3 text-sm text-black/65">
          Номер заказа: <span className="font-mono text-black">{successId}</span>
        </p>
        <button
          type="button"
          onClick={() => router.push("/catalog")}
          className="mt-6 h-11 rounded-md bg-[#2E4C9A] px-4 text-sm font-medium text-white hover:bg-[#243f84]"
        >
          Перейти в каталог
        </button>
      </section>
    );
  }

  return (
    <section>
      <button
        type="button"
        onClick={() => router.push("/catalog")}
        className="inline-flex items-center gap-2 text-sm text-black/45 hover:text-black/70"
      >
        <span className="text-xl">←</span> Назад в каталог
      </button>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#2E4C9A]">Оформление заказа</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-sm font-semibold text-[#2E4C9A]">Контактные данные</div>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <input
                className={
                  "h-12 w-full rounded-md border px-4 text-sm outline-none focus:border-black/30 " +
                  (touched.fullName && !fullNameValid ? "border-red-500" : "border-black/10")
                }
                placeholder="Фамилия Имя Отчество"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
              />
            </label>

            <label className="block">
              <input
                className={
                  "h-12 w-full rounded-md border px-4 text-sm outline-none focus:border-black/30 " +
                  (touched.phone && !phoneValid ? "border-red-500" : "border-black/10")
                }
                placeholder="+7 900 123-45-67"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value) }))}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
              />
            </label>

            <label className="block">
              <input
                className={
                  "h-12 w-full rounded-md border px-4 text-sm outline-none focus:border-black/30 " +
                  (touched.city && !cityValid ? "border-red-500" : "border-black/10")
                }
                placeholder="Город"
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
              />
            </label>

            <label className="block">
              <select
                className="h-12 w-full rounded-md border border-black/10 px-4 text-sm outline-none focus:border-black/30"
                value={form.deliveryMethod}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    deliveryMethod: e.target.value as DeliveryMethod,
                    deliveryAddress: "",
                  }))
                }
              >
                <option value="CDEK">СДЭК</option>
                <option value="YANDEX">Яндекс Доставка</option>
                <option value="PICKUP">Самовывоз (Казань)</option>
              </select>
            </label>

            {needAddress && (
              <label className="block">
                <input
                  className={
                    "h-12 w-full rounded-md border px-4 text-sm outline-none focus:border-black/30 " +
                    (touched.address && !addressValid ? "border-red-500" : "border-black/10")
                  }
                  placeholder="Адрес доставки"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                  onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
                />
              </label>
            )}

            <label className="block">
              <textarea
                className="min-h-24 w-full rounded-md border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30"
                placeholder="Комментарий к заказу"
                value={form.comment}
                onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
              />
            </label>

            {error && <div className="text-sm text-red-600">Ошибка: {error}</div>}

            <button
              type="button"
              disabled={!canCheckout || pending}
              onClick={checkout}
              className={
                "h-12 rounded-md text-sm font-semibold tracking-wide " +
                (canCheckout && !pending ? "bg-black/15 hover:bg-black/20" : "bg-black/10 text-black/35")
              }
            >
              {pending ? "Оформляем..." : "Оформить заказ"}
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-8">
          <h2 className="text-lg font-semibold tracking-tight text-[#2E4C9A]">Ваш заказ</h2>
          <div className="mt-3 text-xs text-black/45">{items.length} поз.</div>

          {items.length === 0 ? (
            <div className="mt-6 text-sm text-black/55">Корзина пуста.</div>
          ) : (
            <div className="mt-6 space-y-6">
              {items.map((item) => (
                <div key={item.variantId} className="grid grid-cols-[96px_1fr_auto] gap-4">
                  <div className="relative overflow-hidden rounded-xl bg-black/5">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.title} width={96} height={96} className="h-24 w-24 object-cover" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-black/75">{item.title}</div>
                    <div className="mt-1 text-xs text-black/45">
                      {item.color} / {item.size}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(item.variantId, Math.max(1, item.qty - 1))}
                        className="h-8 w-8 rounded-full border border-black/15 text-sm hover:bg-black/5"
                      >
                        -
                      </button>
                      <span className="min-w-5 text-center text-sm">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.stock != null && item.qty >= item.stock) return;
                          setQty(item.variantId, item.qty + 1);
                        }}
                        className="h-8 w-8 rounded-full border border-black/15 text-sm hover:bg-black/5"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="ml-2 text-xs text-black/45 underline hover:text-black/70"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-black/65">{formatRub(item.priceRub * item.qty)}</div>
                </div>
              ))}

              <button type="button" onClick={clear} className="text-sm text-black/45 underline hover:text-black/70">
                Очистить корзину
              </button>
            </div>
          )}

          <div className="mt-8 border-t border-black/10 pt-6 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-black/60">Товары</span>
              <span className="text-black/75">{formatRub(subtotal)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-black/60">Доставка</span>
              <span className="text-xs text-black/35">Рассчитывается в заказе</span>
            </div>
            <div className="mt-3 text-xs text-black/45">Бесплатно от {FREE_DELIVERY_FROM_RUB} ₽</div>
          </div>
        </aside>
      </div>
    </section>
  );
}

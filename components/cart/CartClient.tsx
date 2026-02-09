"use client";

import Image from "next/image";
// Link is intentionally not imported because we navigate via useRouter.
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCartStore } from "../../lib/cart-store";
// Button не используем для оформления заказа, так как нужны кастомные цвета.
import { formatRub } from "../../lib/constants";
import { FREE_DELIVERY_FROM_RUB, DeliveryMethod } from "../../lib/delivery";

type CheckoutForm = {
  fullName: string;
  phone: string;
  /** Город покупателя. Обязательное поле. */
  city: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  comment: string;
};

type OrderItemPayload = { variantId: string; qty: number };

type PostOrderPayload = {
  fullName: string;
  phone: string;
  city: string;
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
  const router = useRouter();

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

  // Track whether the user has interacted with each form field. We only show
  // validation errors after the corresponding field has been touched (onBlur).
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.priceRub * it.qty, 0), [items]);

  const needAddress = form.deliveryMethod !== "PICKUP";
  // Валидируем: ФИО состоит из трёх слов, телефон соответствует шаблону,
  // город не пустой, адрес указан если требуется. Для UX ошибки показываются
  // только после того, как пользователь покинет поле (touched).
  const fullNameParts = form.fullName.trim().split(/\s+/).filter(Boolean);
  const fullNameValid = fullNameParts.length === 3;
  const phonePattern = /^\+7\s?\d{3}\s?\d{3}-\d{2}-\d{2}$/;
  const phoneValid = phonePattern.test(form.phone.trim());
  const cityValid = form.city.trim().length > 0;
  const addressValid = form.deliveryAddress.trim().length > 0;

  const fullNameError = fullNameTouched && !fullNameValid ? "Введите фамилию, имя и отчество" : null;
  const phoneError = phoneTouched && !phoneValid ? "Номер должен быть в формате +7 900 123-45-67" : null;
  const cityError = cityTouched && !cityValid ? "Укажите город" : null;
  const addressError = addressTouched && needAddress && !addressValid ? "Укажите адрес" : null;

  const canCheckout =
    items.length > 0 &&
    fullNameValid &&
    phoneValid &&
    cityValid &&
    (!needAddress || addressValid);

  /**
   * Форматирует введённый номер в шаблон +7 900 123-45-67.
   * Удаляет все символы кроме цифр, затем группирует их.
   */
  function formatPhoneInput(value: string): string {
    // Оставляем только цифры
    let digits = value.replace(/\D/g, "");
    // Если номер начинается с 8, отбрасываем эту цифру, так как используем +7
    if (digits.startsWith("8")) {
      digits = digits.slice(1);
    }
    // Если номер начинается с 7, отбрасываем эту цифру для дальнейшего форматирования
    if (digits.startsWith("7")) {
      digits = digits.slice(1);
    }
    let result = "+7";
    if (digits.length > 0) result += " ";
    // Код региона
    if (digits.length >= 3) {
      result += digits.slice(0, 3);
      digits = digits.slice(3);
    } else {
      result += digits;
      digits = "";
    }
    if (digits.length > 0) {
      result += " ";
      if (digits.length >= 3) {
        result += digits.slice(0, 3);
        digits = digits.slice(3);
      } else {
        result += digits;
        digits = "";
      }
    }
    if (digits.length > 0) {
      result += "-";
      if (digits.length >= 2) {
        result += digits.slice(0, 2);
        digits = digits.slice(2);
      } else {
        result += digits;
        digits = "";
      }
    }
    if (digits.length > 0) {
      result += "-";
      result += digits.slice(0, 2);
    }
    return result;
  }

  async function checkout() {
    if (!canCheckout || pending) return;

    setPending(true);
    setError(null);
    setSuccessId(null);

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
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
    } catch (e) {
      setError("ORDER_FAILED");
    } finally {
      setPending(false);
    }
  }

  if (successId) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <h1 className="text-2xl font-semibold">Заказ оформлен</h1>
        {/* Выводим маску заказа DDMMYYN */}
        <p className="mt-2">Номер заказа: <span className="font-mono">{successId}</span></p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 inline-block rounded-xl border border-[#F9B44D] bg-[#FF6634] px-4 py-2 text-sm font-medium text-white hover:bg-[#F9844D]"
        >
          В каталог
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-semibold">Корзина</h1>
      {/* Кнопка очистки корзины – отображается только если есть товары */}
      {items.length > 0 ? (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={clear}
            className="text-sm text-[#FF6634] hover:text-[#EC99A6]"
          >
            Очистить корзину
          </button>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-4 text-[#4B7488] flex items-center gap-3">
          <span>Корзина пуста.</span>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center rounded-xl border border-[#F9B44D] bg-[#FF6634] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#F9844D]"
          >
            В каталог
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            {items.map((it) => (
              <div
                key={it.variantId}
                className="flex gap-3 rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-3"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-50">
                  {it.imageUrl ? (
                    <Image src={it.imageUrl} alt={it.title} fill className="object-cover" />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium leading-snug line-clamp-2">{it.title}</div>
                      <div className="text-sm text-[#4B7488] mt-1">Цвет: {it.color} • Размер: {it.size}</div>
                      <div className="text-sm mt-1">{formatRub(it.priceRub)} / шт</div>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-[#FF6634] hover:text-[#EC99A6]"
                      onClick={() => removeItem(it.variantId)}
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-xl border border-[#F9B44D] bg-[var(--background)] text-[#FF6634] hover:bg-[#FDE9D4]"
                      onClick={() => setQty(it.variantId, Math.max(1, it.qty - 1))}
                    >
                      −
                    </button>
                    <div className="min-w-8 text-center">{it.qty}</div>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-xl border border-[#F9B44D] bg-[var(--background)] text-[#FF6634] hover:bg-[#FDE9D4]"
                      onClick={() => {
                        // не увеличиваем больше, чем остаток на складе
                        if (it.stock != null && it.qty >= it.stock) return;
                        setQty(it.variantId, it.qty + 1);
                      }}
                    >
                      +
                    </button>
                    <div className="ml-auto font-medium">{formatRub(it.priceRub * it.qty)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4 h-fit">
            <div className="text-sm text-[#4B7488]">
              Доставка бесплатно от <b>{FREE_DELIVERY_FROM_RUB} ₽</b>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[#4B7488]">Товары</span>
              <span className="font-medium">{formatRub(subtotal)}</span>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block">
            <div className="text-sm text-[#4B7488]">ФИО</div>
            <input
              className={
                "mt-1 w-full rounded-xl border bg-[var(--background)] px-3 py-2 placeholder-[#AAA19C] " +
                (fullNameError ? "border-red-500" : "border-[#F9B44D]")
              }
              placeholder="Иванов Иван Иванович"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              onBlur={() => setFullNameTouched(true)}
            />
            {fullNameError ? (
              <div className="mt-1 text-xs text-red-500">{fullNameError}</div>
            ) : null}
              </label>

          <label className="block">
            <div className="text-sm text-[#4B7488]">Телефон</div>
            <input
              className={
                "mt-1 w-full rounded-xl border bg-[var(--background)] px-3 py-2 placeholder-[#AAA19C] " +
                (phoneError ? "border-red-500" : "border-[#F9B44D]")
              }
              placeholder="+7 900 123-45-67"
              value={form.phone}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                setForm({ ...form, phone: formatted });
              }}
              onBlur={() => setPhoneTouched(true)}
            />
            {phoneError ? (
              <div className="mt-1 text-xs text-red-500">{phoneError}</div>
            ) : null}
          </label>

          <label className="block">
            <div className="text-sm text-[#4B7488]">Город</div>
            <input
              className={
                "mt-1 w-full rounded-xl border bg-[var(--background)] px-3 py-2 placeholder-[#AAA19C] " +
                (cityError ? "border-red-500" : "border-[#F9B44D]")
              }
              placeholder="Ваш город"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              onBlur={() => setCityTouched(true)}
            />
            {cityError ? (
              <div className="mt-1 text-xs text-red-500">{cityError}</div>
            ) : null}
          </label>

              <label className="block">
            <div className="text-sm text-[#4B7488]">Способ доставки</div>
            <select
              className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[#4B7488]"
              value={form.deliveryMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  deliveryMethod: e.target.value as DeliveryMethod,
                  deliveryAddress: "",
                })
              }
            >
              <option value="CDEK">СДЭК</option>
              <option value="YANDEX">Яндекс Доставка</option>
              <option value="PICKUP">Самовывоз (Казань)</option>
            </select>
              </label>

              {needAddress ? (
                <label className="block">
                  <div className="text-sm text-[#4B7488]">
                    {form.deliveryMethod === "CDEK"
                      ? "Адрес пункта СДЭК"
                      : "Адрес Яндекс Доставка"}
                  </div>
                  <input
                    className={
                      "mt-1 w-full rounded-xl border bg-[var(--background)] px-3 py-2 placeholder-[#AAA19C] " +
                      (addressError ? "border-red-500" : "border-[#F9B44D]")
                    }
                    placeholder="Улица, дом, квартира"
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                    onBlur={() => setAddressTouched(true)}
                  />
                  {addressError ? (
                    <div className="mt-1 text-xs text-red-500">{addressError}</div>
                  ) : null}
                </label>
              ) : null}

              <label className="block">
                <div className="text-sm text-[#4B7488]">Комментарий (необязательно)</div>
                <textarea
                  className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 placeholder-[#AAA19C]"
                  rows={3}
                  placeholder="Ваши пожелания по заказу"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
              </label>

              {error ? <div className="text-sm text-red-600">Ошибка: {error}</div> : null}

              <button
                type="button"
                disabled={!canCheckout || pending}
                onClick={checkout}
                className={
                  "w-full rounded-xl px-4 py-3 font-medium transition " +
                  (canCheckout && !pending
                    ? "bg-[#F9B44D] text-[#2D2C2A] hover:bg-[#FDE07F]"
                    : "bg-[#EADDCB] text-[#AAA19C] cursor-not-allowed")
                }
              >
                {pending ? "Оформляем..." : "Оформить заказ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

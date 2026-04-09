"use client";

import Link from "next/link";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { Container } from "@/components/ui/container";

export function CartPageContent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Корзина</p>
            <h1 className="mt-4 text-4xl font-semibold text-stone-950">Пока пусто</h1>
            <p className="mt-4 text-base leading-7 text-stone-700">
              Добавьте понравившиеся вещи из каталога, чтобы собрать свою подборку и
              вернуться к ней в удобный момент.
            </p>
            <Link
              href="/catalog"
              className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Вернуться в каталог
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Корзина</p>
            <h1 className="mt-3 text-4xl font-semibold text-stone-950">Ваш выбор</h1>
          </div>
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-stone-950">{item.product.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Цвет: {item.product.colorName} • Размер: {item.product.size}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-stone-950">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => decreaseItem(item.id)}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-800"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-800"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-500">Количество: {item.quantity}</p>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Итого</p>
          <p className="mt-4 text-3xl font-semibold text-stone-950">{formatPrice(total)}</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Оставьте контактные данные, и мы свяжемся с вами, чтобы уточнить детали заказа.
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="mt-6 w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-900"
          >
            Очистить корзину
          </button>
          <CheckoutForm />
        </aside>
      </Container>
    </section>
  );
}

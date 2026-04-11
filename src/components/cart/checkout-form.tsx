"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  checkoutFormSchema,
  deliveryMethodOptions,
  type CheckoutFormValues,
} from "@/lib/validations/order";
import { useCartStore } from "@/store/cart-store";

type CheckoutFormProps = {
  onOrderSuccess: (orderNumber: string) => void;
};

export function CheckoutForm({ onOrderSuccess }: CheckoutFormProps) {
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      deliveryMethod: "cdek",
      deliveryAddress: "",
      comment: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError("Корзина пуста. Добавьте товары перед оформлением заказа.");
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        items: items.map((item) => ({
          productId: item.productId,
          productColorId: item.productColorId ?? null,
          productVariantId: item.product.productVariantId ?? item.variantId,
          title: item.product.title,
          color: item.product.colorName || null,
          size: item.product.size || null,
          sku: item.product.sku || null,
          price: item.product.price,
          quantity: item.quantity,
        })),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setSubmitError(result.error ?? "Не удалось оформить заказ. Попробуйте ещё раз.");
      return;
    }

    clearCart();
    onOrderSuccess(result.orderNumber);
    reset();
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-900" htmlFor="fullName">
          Имя и фамилия
        </label>
        <input
          id="fullName"
          {...register("fullName")}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
          placeholder="Александра Иванова"
        />
        {errors.fullName ? (
          <p className="mt-2 text-xs text-red-600">{errors.fullName.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-900" htmlFor="phone">
          Телефон
        </label>
        <input
          id="phone"
          {...register("phone")}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
          placeholder="+7 999 123-45-67"
        />
        {errors.phone ? <p className="mt-2 text-xs text-red-600">{errors.phone.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-900" htmlFor="city">
          Город
        </label>
        <input
          id="city"
          {...register("city")}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
          placeholder="Москва"
        />
        {errors.city ? <p className="mt-2 text-xs text-red-600">{errors.city.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-900" htmlFor="deliveryMethod">
          Способ доставки
        </label>
        <select
          id="deliveryMethod"
          {...register("deliveryMethod")}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
        >
          {deliveryMethodOptions.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
        {errors.deliveryMethod ? (
          <p className="mt-2 text-xs text-red-600">{errors.deliveryMethod.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-900" htmlFor="deliveryAddress">
          Адрес доставки
        </label>
        <input
          id="deliveryAddress"
          {...register("deliveryAddress")}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
          placeholder="Улица, дом, квартира или пункт выдачи"
        />
        {errors.deliveryAddress ? (
          <p className="mt-2 text-xs text-red-600">{errors.deliveryAddress.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-900" htmlFor="comment">
          Комментарий
        </label>
        <textarea
          id="comment"
          {...register("comment")}
          className="min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
          placeholder="Удобное время для звонка или пожелания по доставке"
        />
        {errors.comment ? (
          <p className="mt-2 text-xs text-red-600">{errors.comment.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isSubmitting ? "Отправка..." : "Оставить заявку"}
      </button>

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
    </form>
  );
}

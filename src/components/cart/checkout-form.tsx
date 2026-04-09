"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/lib/validations/order";

export function CheckoutForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      comment: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    await Promise.resolve(values);
    setIsSubmitted(true);
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

      {isSubmitted ? (
        <p className="text-sm text-emerald-700">
          Спасибо, ваша заявка принята. Мы сохранили данные формы и можем продолжить оформление.
        </p>
      ) : null}
    </form>
  );
}

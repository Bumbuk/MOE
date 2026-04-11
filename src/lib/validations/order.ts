import { z } from "zod";

export const deliveryMethodOptions = [
  { value: "cdek", label: "СДЭК" },
  { value: "courier", label: "Курьер" },
  { value: "pickup", label: "Самовывоз" },
] as const;

export const deliveryMethodValues = deliveryMethodOptions.map((option) => option.value) as [
  (typeof deliveryMethodOptions)[number]["value"],
  ...(typeof deliveryMethodOptions)[number]["value"][],
];

export type DeliveryMethodValue = (typeof deliveryMethodValues)[number];

function hasAtLeastThreeWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length >= 3;
}

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(3, "Введите имя и фамилию.")
    .max(80, "Слишком длинное имя."),
  phone: z.string().min(1, "Введите телефон.").max(20, "Слишком длинный номер."),
  city: z.string().min(1, "Введите город."),
  deliveryMethod: z.enum(deliveryMethodValues, {
    error: "Выберите способ доставки.",
  }),
  deliveryAddress: z.string().min(1, "Введите адрес доставки."),
  comment: z.string().max(300, "Комментарий слишком длинный.").optional(),
}).refine((value) => hasAtLeastThreeWords(value.fullName), {
  message: "Укажите минимум три слова в ФИО.",
  path: ["fullName"],
});

export const checkoutOrderItemSchema = z.object({
  productId: z.string().min(1, "Не найден товар."),
  productColorId: z.string().nullable().optional(),
  productVariantId: z.string().nullable().optional(),
  title: z.string().min(1, "Не найдено название товара."),
  color: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  price: z.number().positive("Некорректная цена товара."),
  quantity: z.number().int().positive("Количество должно быть больше нуля."),
});

export const checkoutOrderRequestSchema = checkoutFormSchema.extend({
  items: z.array(checkoutOrderItemSchema).min(1, "Корзина не должна быть пустой."),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type CheckoutOrderItemInput = z.infer<typeof checkoutOrderItemSchema>;
export type CheckoutOrderRequest = z.infer<typeof checkoutOrderRequestSchema>;

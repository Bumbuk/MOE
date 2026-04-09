import { z } from "zod";

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Введите имя и фамилию.")
    .max(80, "Слишком длинное имя."),
  phone: z
    .string()
    .min(10, "Введите телефон.")
    .max(20, "Слишком длинный номер."),
  city: z.string().min(2, "Введите город."),
  comment: z.string().max(300, "Комментарий слишком длинный.").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

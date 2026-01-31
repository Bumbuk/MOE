import { z } from "zod";

const optStr = (max: number) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => (typeof v === "string" ? v.trim() : ""))
    .refine((v) => v.length <= max, `Максимум ${max} символов`)
    .transform((v) => (v.length ? v : undefined));

const optIntStr = (maxDigits: number) =>
  optStr(maxDigits).refine((v) => (v ? /^\d+$/.test(v) : true), "Должно быть числом");

export const ProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(24),
  color: optStr(60),
  q: optStr(80),
  category: optStr(60),

  // sizes=86,92,98
  sizes: optStr(200).transform((v) => {
    if (!v) return undefined;
    const arr = v
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    return arr.length ? arr : undefined;
  }),

  // совместимость со старым `size`
  size: optStr(20),

  // в рублях (строкой), конвертим в API
  minPrice: optIntStr(10),
  maxPrice: optIntStr(10),

  sort: optStr(20).transform((v) => v ?? "new"),
});

export const SlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, "Некорректный slug")
  .max(120);

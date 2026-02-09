import { DeliveryMethod } from "@prisma/client";

export { DeliveryMethod };

// Порог бесплатной доставки (RUB)
export const FREE_DELIVERY_FROM_RUB = 5000;

export function calcDeliveryPriceRub(subtotalRub: number, method: DeliveryMethod): number {
  if (method === "PICKUP") return 0;
  if (subtotalRub >= FREE_DELIVERY_FROM_RUB) return 0;
  if (method === "CDEK") return 399;
  if (method ==="YANDEX") return 499;

  // оставляем как было (ты сам потом подстроишь)
  return 0
}

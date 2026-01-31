// Общие типы/логика доставки, которые можно использовать и на клиенте, и на сервере.
// Не импортируем Prisma в клиентский бандл.

export type DeliveryMethod = "CDEK" | "YANDEX" | "PICKUP";

// Порог бесплатной доставки (RUB)
export const FREE_DELIVERY_FROM_RUB = 5000;

export function calcDeliveryPriceRub(subtotalRub: number, method: DeliveryMethod): number {
  if (method === "PICKUP") return 0;
  if (subtotalRub >= FREE_DELIVERY_FROM_RUB) return 0;
  if (method === "CDEK") return 399;
  if (method === "YANDEX") return 499;
  return 0;
}

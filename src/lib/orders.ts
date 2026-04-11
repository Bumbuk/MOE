import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import {
  deliveryMethodOptions,
  type CheckoutOrderItemInput,
  type DeliveryMethodValue,
} from "@/lib/validations/order";

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

export type PreparedOrderItem = {
  productId?: string;
  productColorId?: string;
  productVariantId?: string;
  productTitleSnapshot: string;
  colorNameSnapshot?: string;
  sizeSnapshot?: string;
  skuSnapshot?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderTotals = {
  subtotal: number;
  deliveryPrice: number;
  total: number;
  freeDeliveryApplied: boolean;
};

function formatOrderDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}${month}${year}`;
}

export function generateOrderNumber(date = new Date()) {
  const suffix = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `${formatOrderDate(date)}-${suffix}`;
}

export function calculateOrderTotals(subtotal: number): OrderTotals {
  const deliveryPrice = 0;
  const freeDeliveryApplied = true;
  const total = subtotal + deliveryPrice;

  return {
    subtotal,
    deliveryPrice,
    total,
    freeDeliveryApplied,
  };
}

export function getDeliveryMethodLabel(value: DeliveryMethodValue) {
  return (
    deliveryMethodOptions.find((option) => option.value === value)?.label ?? value
  );
}

export async function prepareOrderItems(items: CheckoutOrderItemInput[]) {
  const variantIds = items
    .map((item) => item.productVariantId)
    .filter((value): value is string => Boolean(value));

  const variants =
    variantIds.length > 0
      ? await db.productVariant.findMany({
          where: {
            id: {
              in: variantIds,
            },
          },
          select: {
            id: true,
            productColorId: true,
            size: true,
            sku: true,
            price: true,
            productColor: {
              select: {
                id: true,
                name: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        })
      : [];

  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

  return items.map<PreparedOrderItem>((item) => {
    const variant = item.productVariantId ? variantsById.get(item.productVariantId) : null;

    if (item.productVariantId && !variant) {
      throw new OrderValidationError("Один из товаров в корзине больше недоступен.");
    }

    const unitPrice = variant ? Number(variant.price) : item.price;
    const quantity = item.quantity;

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new OrderValidationError("Не удалось определить актуальную цену товара.");
    }

    return {
      productId: variant?.productColor.product.id ?? item.productId,
      productColorId: variant?.productColor.id ?? item.productColorId ?? undefined,
      productVariantId: variant?.id ?? item.productVariantId ?? undefined,
      productTitleSnapshot: variant?.productColor.product.title ?? item.title,
      colorNameSnapshot: variant?.productColor.name ?? item.color ?? undefined,
      sizeSnapshot: variant?.size ?? item.size ?? undefined,
      skuSnapshot: variant?.sku ?? item.sku ?? undefined,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });
}

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  calculateOrderTotals,
  generateOrderNumber,
  getDeliveryMethodLabel,
  OrderValidationError,
  prepareOrderItems,
} from "@/lib/orders";
import { sendTelegramOrderNotification } from "@/lib/telegram";
import { checkoutOrderRequestSchema } from "@/lib/validations/order";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutOrderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Некорректные данные заказа.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (parsed.data.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Корзина не должна быть пустой.",
        },
        { status: 400 },
      );
    }

    const preparedItems = await prepareOrderItems(parsed.data.items);
    const subtotal = preparedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const totals = calculateOrderTotals(subtotal);
    const orderNumber = generateOrderNumber();

    const createdOrder = await db.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.fullName,
        phone: parsed.data.phone,
        city: parsed.data.city,
        deliveryMethod: getDeliveryMethodLabel(parsed.data.deliveryMethod),
        deliveryAddress: parsed.data.deliveryAddress,
        comment: parsed.data.comment || null,
        subtotal: new Prisma.Decimal(totals.subtotal),
        deliveryPrice: new Prisma.Decimal(totals.deliveryPrice),
        total: new Prisma.Decimal(totals.total),
        freeDeliveryApplied: totals.freeDeliveryApplied,
        status: "NEW",
        items: {
          create: preparedItems.map((item) => ({
            productId: item.productId ?? null,
            productColorId: item.productColorId ?? null,
            productVariantId: item.productVariantId ?? null,
            productTitleSnapshot: item.productTitleSnapshot,
            colorNameSnapshot: item.colorNameSnapshot ?? null,
            sizeSnapshot: item.sizeSnapshot ?? null,
            skuSnapshot: item.skuSnapshot ?? null,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            lineTotal: new Prisma.Decimal(item.lineTotal),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    try {
      await sendTelegramOrderNotification({
        orderNumber: createdOrder.orderNumber,
        customerName: createdOrder.customerName,
        phone: createdOrder.phone,
        city: createdOrder.city,
        deliveryMethod: createdOrder.deliveryMethod,
        deliveryAddress: createdOrder.deliveryAddress,
        comment: createdOrder.comment,
        subtotal: Number(createdOrder.subtotal),
        deliveryPrice: Number(createdOrder.deliveryPrice),
        total: Number(createdOrder.total),
        freeDeliveryApplied: createdOrder.freeDeliveryApplied,
        items: createdOrder.items.map((item) => ({
          productTitleSnapshot: item.productTitleSnapshot,
          colorNameSnapshot: item.colorNameSnapshot,
          sizeSnapshot: item.sizeSnapshot,
          skuSnapshot: item.skuSnapshot,
          quantity: item.quantity,
          lineTotal: Number(item.lineTotal),
        })),
      });
    } catch (telegramError) {
      console.error("Telegram notification error:", telegramError);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      );
    }

    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Не удалось оформить заказ. Попробуйте ещё раз.",
      },
      { status: 500 },
    );
  }
}

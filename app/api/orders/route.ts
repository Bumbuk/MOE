import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/server/db";
import { calcDeliveryPriceRub, FREE_DELIVERY_FROM_RUB } from "../../../lib/shared/delivery";
import type { DeliveryMethod as SharedDeliveryMethod } from "../../../lib/shared/delivery";
import { DeliveryMethod as PrismaDeliveryMethod } from "@prisma/client";
import { sendTelegram } from "../../../lib/server/telegram";

export const runtime = "nodejs";

const BodySchema = z.object({
  fullName: z.string().min(1).max(120),
  phone: z.string().min(5).max(30),
  comment: z.string().max(500).optional().nullable(),

  deliveryMethod: z.enum(["CDEK", "YANDEX", "PICKUP"]),
  deliveryAddress: z.string().max(200).optional().nullable(),

  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        qty: z.number().int().min(1).max(99),
      })
    )
    .min(1),
});

function escHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function deliveryLabel(m: SharedDeliveryMethod) {
  if (m === "CDEK") return "СДЭК";
  if (m === "YANDEX") return "Яндекс Доставка";
  return "Самовывоз (Казань)";
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const body = parsed.data;
  const method = body.deliveryMethod as SharedDeliveryMethod;
  const methodDb = body.deliveryMethod as PrismaDeliveryMethod;

  if (method !== "PICKUP") {
    const addr = (body.deliveryAddress ?? "").trim();
    if (!addr) return NextResponse.json({ error: "ADDRESS_REQUIRED" }, { status: 400 });
  }

  const variantIds = body.items.map((i) => i.variantId);

  // 1) грузим варианты (не доверяем клиенту), берём только ACTIVE варианты
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds }, status: "ACTIVE" },
    select: {
      id: true,
      size: true,
      price: true,
      stock: true,
      color: {
        select: {
          name: true,
          product: { select: { id: true, title: true, slug: true } },
        },
      },
    },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json({ error: "VARIANT_NOT_FOUND" }, { status: 400 });
  }

  const byId = new Map(variants.map((v) => [v.id, v]));

  // 2) считаем позиции + проверка стока
  const items = body.items.map((i) => {
    const v = byId.get(i.variantId)!;
    const stock = v.stock ?? 0;

    if (i.qty > stock) {
      return { error: "OUT_OF_STOCK" as const, variantId: v.id };
    }

    const product = v.color.product;
    const unit = v.price; // RUB
    const line = unit * i.qty;

    return {
      productId: product.id,
      variantId: v.id,
      title: product.title,
      slug: product.slug,
      color: v.color.name,
      size: v.size,
      unitPrice: unit,
      qty: i.qty,
      linePrice: line,
    };
  });

  const oos = items.find((x) => "error" in x);
  if (oos && "error" in oos) {
    return NextResponse.json({ error: "OUT_OF_STOCK", variantId: oos.variantId }, { status: 409 });
  }

  const orderItems = items as Array<{
    productId: string;
    variantId: string;
    title: string;
    slug: string;
    color: string;
    size: string;
    unitPrice: number;
    qty: number;
    linePrice: number;
  }>;

  const subtotal = orderItems.reduce((s, it) => s + it.linePrice, 0);
  const deliveryPrice = calcDeliveryPriceRub(subtotal, method);
  const total = subtotal + deliveryPrice;

  // 3) создаём заказ + позиции
  const order = await prisma.order.create({
    data: {
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      deliveryMethod: methodDb,
      deliveryAddress: method === "PICKUP" ? null : (body.deliveryAddress ?? "").trim(),
      comment: body.comment?.trim() || null,
      deliveryPrice,
      subtotal,
      total,
      items: { create: orderItems },
    },
    select: { id: true },
  });

  // 4) Telegram (best-effort, чтобы заказ не ломался если TG упал)
  const lines = orderItems
    .map((it) => `• ${it.title} (Цвет: ${it.color} • Размер: ${it.size}) × ${it.qty} — ${it.linePrice} ₽`)
    .join("\n");

  const msg =
    `<b>Новый заказ</b> #${escHtml(order.id)}\n\n` +
    `<b>Контакты</b>\n${escHtml(body.fullName)}\n${escHtml(body.phone)}\n\n` +
    `<b>Доставка</b>\n${escHtml(deliveryLabel(method))}\n` +
    `${method === "PICKUP" ? "" : `${escHtml((body.deliveryAddress ?? "").trim())}\n`}\n` +
    `<b>Состав</b>\n${escHtml(lines)}\n\n` +
    `<b>Суммы</b>\nТовары: ${subtotal} ₽\nДоставка: ${deliveryPrice} ₽\nИтого: ${total} ₽\n` +
    `${subtotal >= FREE_DELIVERY_FROM_RUB ? "(Бесплатная доставка применена)" : ""}` +
    `${body.comment ? `\n\n<b>Комментарий</b>\n${escHtml(body.comment)}` : ""}`;

  sendTelegram(msg).catch((e: unknown) => {
    console.error("Telegram send failed:", e);
  });

  return NextResponse.json({ orderId: order.id });
}

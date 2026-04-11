import { formatPrice } from "@/lib/format";

type TelegramOrderItem = {
  productTitleSnapshot: string;
  colorNameSnapshot?: string | null;
  sizeSnapshot?: string | null;
  skuSnapshot?: string | null;
  quantity: number;
  lineTotal: number;
};

type TelegramOrderPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  deliveryMethod: string;
  deliveryAddress: string;
  comment?: string | null;
  subtotal: number;
  deliveryPrice: number;
  total: number;
  freeDeliveryApplied: boolean;
  items: TelegramOrderItem[];
};

function buildItemLabel(item: TelegramOrderItem) {
  const details = [
    item.colorNameSnapshot ? `Цвет: ${item.colorNameSnapshot}` : null,
    item.sizeSnapshot ? `Размер: ${item.sizeSnapshot}` : null,
  ].filter(Boolean);

  const itemName = item.skuSnapshot ? `Арт ${item.skuSnapshot}` : item.productTitleSnapshot;
  const suffix = details.length > 0 ? ` (${details.join(" • ")})` : "";

  return `• ${itemName}${suffix} × ${item.quantity} — ${formatPrice(item.lineTotal)}`;
}

export function formatTelegramOrderMessage(order: TelegramOrderPayload) {
  const sections = [
    `Новый заказ #${order.orderNumber}`,
    "",
    "Контакты",
    order.customerName,
    order.phone,
    order.city,
    "",
    "Доставка",
    order.deliveryMethod,
    order.deliveryAddress,
    "",
    "Состав",
    ...order.items.map(buildItemLabel),
    "",
    "Суммы",
    `Товары: ${formatPrice(order.subtotal)}`,
    `Доставка: ${formatPrice(order.deliveryPrice)}`,
    `Итого: ${formatPrice(order.total)}`,
    ...(order.freeDeliveryApplied ? ["(Бесплатная доставка применена)"] : []),
  ];

  if (order.comment) {
    sections.push("", "Комментарий", order.comment);
  }

  return sections.join("\n");
}

export async function sendTelegramOrderNotification(order: TelegramOrderPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram is not configured.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramOrderMessage(order),
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Telegram API responded with ${response.status}: ${responseText}`);
  }

  return response.json();
}
